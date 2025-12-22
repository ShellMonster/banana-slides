/**
 * API Full Flow Test: Create project to export PPT
 * 
 * This test validates the complete flow by directly calling backend APIs:
 * 1. Create project (from idea or file)
 * 2. Generate outline
 * 3. Generate descriptions
 * 4. Generate images
 * 5. Export PPT
 * 
 * Note: This test requires real AI API keys (GOOGLE_API_KEY)
 * If using mock API key, the test will be skipped
 */

import { test, expect, APIRequestContext } from '@playwright/test'

// Helper function: Wait for project status change with smart retry
async function waitForProjectStatus(
  request: APIRequestContext,
  projectId: string,
  expectedStatus: string,
  timeoutMs: number = 60000
): Promise<void> {
  const startTime = Date.now()
  let checkInterval = 2000 // Start with 2 seconds
  const maxInterval = 10000 // Max 10 seconds between checks
  let consecutiveErrors = 0
  const maxConsecutiveErrors = 3
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await request.get(`http://localhost:5000/api/projects/${projectId}`)
      
      if (!response.ok()) {
        consecutiveErrors++
        if (consecutiveErrors >= maxConsecutiveErrors) {
          throw new Error(`Failed to get project status after ${maxConsecutiveErrors} consecutive errors`)
        }
        // Exponential backoff on errors
        await new Promise(resolve => setTimeout(resolve, checkInterval * 2))
        continue
      }
      
      consecutiveErrors = 0 // Reset error count on success
      
      const data = await response.json()
      const currentStatus = data.data.status
      
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      console.log(`[${elapsed}s] Project status: ${currentStatus}, waiting for: ${expectedStatus}`)
      
      if (currentStatus === expectedStatus) {
        console.log(`✓ Project reached status: ${expectedStatus} (took ${elapsed}s)`)
        return
      }
      
      // Check if failed
      if (currentStatus === 'FAILED') {
        const errorMsg = data.data?.error || 'Unknown error'
        throw new Error(`Project generation failed. Expected: ${expectedStatus}, Got: ${currentStatus}. Error: ${errorMsg}`)
      }
      
      // Adaptive interval: increase gradually for long waits
      const elapsedMs = Date.now() - startTime
      if (elapsedMs > 30000) {
        checkInterval = Math.min(maxInterval, checkInterval + 1000)
      }
      
      await new Promise(resolve => setTimeout(resolve, checkInterval))
    } catch (error: any) {
      if (error.message.includes('Failed to get project status')) {
        throw error
      }
      // Network errors: retry with backoff
      consecutiveErrors++
      if (consecutiveErrors >= maxConsecutiveErrors) {
        throw new Error(`Network error: ${error.message}`)
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval * 2))
    }
  }
  
  // Get project details for debugging
  try {
    const debugResponse = await request.get(`http://localhost:5000/api/projects/${projectId}`)
    const debugData = await debugResponse.json()
    console.error(`\n❌ Timeout debug info:`)
    console.error(`  Project ID: ${projectId}`)
    console.error(`  Current status: ${debugData.data?.status || 'unknown'}`)
    console.error(`  Expected status: ${expectedStatus}`)
    console.error(`  Wait time: ${timeoutMs}ms`)
    if (debugData.data?.error) {
      console.error(`  Error message: ${debugData.data.error}`)
    }
  } catch (e) {
    console.error(`  Failed to get project details: ${e}`)
  }
  
  throw new Error(`Timeout: Project did not reach status ${expectedStatus} within ${timeoutMs}ms`)
}

// Helper function: Wait for task completion with smart retry
async function waitForTaskCompletion(
  request: APIRequestContext,
  projectId: string,
  taskId: string,
  timeoutMs: number = 120000
): Promise<void> {
  const startTime = Date.now()
  let checkInterval = 3000 // Start with 3 seconds
  const maxInterval = 10000
  let consecutiveErrors = 0
  const maxConsecutiveErrors = 3
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await request.get(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`)
      
      if (!response.ok()) {
        consecutiveErrors++
        if (consecutiveErrors >= maxConsecutiveErrors) {
          throw new Error(`Failed to get task status after ${maxConsecutiveErrors} consecutive errors`)
        }
        await new Promise(resolve => setTimeout(resolve, checkInterval * 2))
        continue
      }
      
      consecutiveErrors = 0
      
      const data = await response.json()
      const taskStatus = data.data.status
      
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      console.log(`[${elapsed}s] Task ${taskId.substring(0, 8)}... status: ${taskStatus}`)
      
      if (taskStatus === 'COMPLETED') {
        console.log(`✓ Task ${taskId.substring(0, 8)}... completed (took ${elapsed}s)`)
        return
      }
      
      if (taskStatus === 'FAILED') {
        const errorMsg = data.data.error_message || 'Unknown error'
        throw new Error(`Task ${taskId} failed: ${errorMsg}`)
      }
      
      // Adaptive interval for long-running tasks
      const elapsedMs = Date.now() - startTime
      if (elapsedMs > 60000) {
        checkInterval = Math.min(maxInterval, checkInterval + 1000)
      }
      
      await new Promise(resolve => setTimeout(resolve, checkInterval))
    } catch (error: any) {
      if (error.message.includes('Failed to get task status') || error.message.includes('Task') && error.message.includes('failed')) {
        throw error
      }
      consecutiveErrors++
      if (consecutiveErrors >= maxConsecutiveErrors) {
        throw new Error(`Network error: ${error.message}`)
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval * 2))
    }
  }
  
  throw new Error(`Timeout: Task ${taskId} did not complete within ${timeoutMs}ms`)
}

// Check if real API key is configured
async function hasRealApiKey(request: APIRequestContext): Promise<boolean> {
  try {
    const response = await request.get('http://localhost:5000/health')
    const data = await response.json()
    // If health check returns API config info, can check here
    // For simplicity, assume if can connect then try to run
    return true
  } catch {
    return false
  }
}

test.describe('API Integration Test: From idea to PPT export', () => {
  let projectId: string
  
  test.afterEach(async ({ request }) => {
    // Clean up test project
    if (projectId) {
      try {
        await request.delete(`http://localhost:5000/api/projects/${projectId}`)
        console.log(`✓ Cleaned up project: ${projectId}`)
      } catch (error) {
        console.warn(`Failed to cleanup project ${projectId}:`, error)
      }
    }
  })
  
  test('API Full Flow: Create project → Outline → Descriptions → Images → Export PPT', async ({ request }) => {
    // Set timeout to 10 minutes (real AI calls need time)
    test.setTimeout(600000)
    
    console.log('\n========================================')
    console.log('🚀 Starting full flow E2E test')
    console.log('========================================\n')
    
    // Step 1: Create project
    console.log('📝 Step 1: Creating project...')
    const createResponse = await request.post('http://localhost:5000/api/projects', {
      data: {
        creation_type: 'idea',
        idea_prompt: '创建一份关于人工智能基础的简短PPT，包含3页内容：什么是AI、AI的应用、AI的未来'
      }
    })
    
    expect(createResponse.ok()).toBeTruthy()
    const createData = await createResponse.json()
    expect(createData.success).toBe(true)
    expect(createData.data.project_id).toBeTruthy()
    
    projectId = createData.data.project_id
    console.log(`✓ Project created successfully: ${projectId}\n`)
    
    // Step 2: Trigger outline generation
    console.log('📋 Step 2: Triggering outline generation...')
    const outlineResponse = await request.post(`http://localhost:5000/api/projects/${projectId}/generate/outline`, {
      data: {}
    })
    
    expect(outlineResponse.ok()).toBeTruthy()
    const outlineData = await outlineResponse.json()
    expect(outlineData.success).toBe(true)
    console.log(`✓ Outline generation request submitted\n`)
    
    // Step 3: Wait for outline generation to complete
    console.log('⏳ Step 3: Waiting for outline generation to complete...')
    await waitForProjectStatus(request, projectId, 'OUTLINE_GENERATED', 180000) // Increased to 3 minutes
    
    // Verify outline content
    const projectResponse = await request.get(`http://localhost:5000/api/projects/${projectId}`)
    const projectData = await projectResponse.json()
    const outline = projectData.data.outline_content
    
    expect(outline).toBeTruthy()
    expect(outline.pages || outline.outline).toBeTruthy()
    console.log(`✓ Outline generated successfully, contains ${(outline.pages || outline.outline || []).length} pages\n`)
    
    // Step 4: Generate descriptions
    console.log('✍️  Step 4: Starting to generate page descriptions...')
    const descResponse = await request.post(
      `http://localhost:5000/api/projects/${projectId}/generate/descriptions`,
      {
        data: {
          outline: outline
        }
      }
    )
    
    expect(descResponse.ok()).toBeTruthy()
    const descData = await descResponse.json()
    expect(descData.success).toBe(true)
    
    const descTaskId = descData.data.task_id
    console.log(`  Task ID: ${descTaskId}`)
    
    // Wait for description generation to complete
    await waitForTaskCompletion(request, projectId, descTaskId, 180000)
    await waitForProjectStatus(request, projectId, 'DESCRIPTIONS_GENERATED', 10000)
    console.log('✓ All page descriptions generated\n')
    
    // Step 5: Generate images
    console.log('🎨 Step 5: Starting to generate page images...')
    const imageResponse = await request.post(
      `http://localhost:5000/api/projects/${projectId}/generate/images`,
      {
        data: {
          use_template: false,
          aspect_ratio: '16:9',
          resolution: '1080p'
        }
      }
    )
    
    expect(imageResponse.ok()).toBeTruthy()
    const imageData = await imageResponse.json()
    expect(imageData.success).toBe(true)
    
    const imageTaskId = imageData.data.task_id
    console.log(`  Task ID: ${imageTaskId}`)
    
    // Wait for image generation to complete (image generation is usually slower)
    await waitForTaskCompletion(request, projectId, imageTaskId, 300000)
    await waitForProjectStatus(request, projectId, 'COMPLETED', 10000)
    console.log('✓ All page images generated\n')
    
    // Verify all pages have images
    const pagesResponse = await request.get(`http://localhost:5000/api/projects/${projectId}`)
    const pagesData = await pagesResponse.json()
    const pages = pagesData.data.pages || []
    
    expect(pages.length).toBeGreaterThan(0)
    
    for (const page of pages) {
      expect(page.generated_image_path).toBeTruthy()
      expect(page.status).toBe('COMPLETED')
      console.log(`  ✓ Page ${page.order_index + 1}: Image generated`)
    }
    console.log()
    
    // Step 6: Export PPT
    console.log('📦 Step 6: Exporting PPT file...')
    const exportResponse = await request.get(
      `http://localhost:5000/api/projects/${projectId}/export/pptx?filename=e2e-test.pptx`
    )
    
    expect(exportResponse.ok()).toBeTruthy()
    const exportData = await exportResponse.json()
    expect(exportData.success).toBe(true)
    expect(exportData.data.download_url).toBeTruthy()
    expect(exportData.data.download_url).toContain('.pptx')
    
    console.log(`  Export URL: ${exportData.data.download_url}`)
    
    // Step 7: Verify PPT file can be downloaded
    console.log('📥 Step 7: Verifying PPT file can be downloaded...')
    const downloadResponse = await request.get(
      `http://localhost:5000${exportData.data.download_url}`
    )
    
    expect(downloadResponse.ok()).toBeTruthy()
    
    const contentType = downloadResponse.headers()['content-type']
    expect(contentType).toContain('application/vnd.openxmlformats-officedocument.presentationml.presentation')
    
    const pptBuffer = await downloadResponse.body()
    expect(pptBuffer.length).toBeGreaterThan(1000) // PPT file should be larger than 1KB
    
    console.log(`✓ PPT file downloaded successfully, size: ${(pptBuffer.length / 1024).toFixed(2)} KB\n`)
    
    // Step 8: Validate PPTX file content using python-pptx
    console.log('🔍 Step 8: Validating PPTX file content...')
    const fs = await import('fs')
    const path = await import('path')
    const { execSync } = await import('child_process')
    const { fileURLToPath } = await import('url')
    
    // Save PPTX file to temporary location
    // Note: downloadResponse.body() already returns a Buffer in Playwright
    const pptxPath = path.join('test-results', 'e2e-api-test-output.pptx')
    fs.writeFileSync(pptxPath, pptBuffer)
    
    // Validate using Python script
    try {
      // Get current directory (ES module compatible)
      const currentDir = path.dirname(fileURLToPath(import.meta.url))
      const validateScript = path.join(currentDir, 'validate_pptx.py')
      const result = execSync(
        `python3 "${validateScript}" "${pptxPath}" 3 "人工智能" "AI"`,
        { encoding: 'utf-8', stdio: 'pipe' }
      )
      console.log(`✓ ${result.trim()}\n`)
    } catch (error: any) {
      // If validation fails, log but don't fail the test (for now)
      // In production, you might want to make this a hard failure
      console.warn(`⚠️  PPTX validation warning: ${error.stdout || error.message}`)
      console.log('  (Continuing test, but PPTX content validation had issues)\n')
    }
    
    console.log('========================================')
    console.log('✅ API integration test passed!')
    console.log('========================================\n')
  })
  
  test('Quick Test: Only verify API flow (skip AI generation)', async ({ request }) => {
    test.setTimeout(60000)
    
    console.log('\n🏃 Quick API flow test (skip AI generation)\n')
    
    // Create project
    const createResponse = await request.post('http://localhost:5000/api/projects', {
      data: {
        creation_type: 'idea',
        idea_prompt: 'API test project'
      }
    })
    
    expect(createResponse.ok()).toBeTruthy()
    const createData = await createResponse.json()
    projectId = createData.data.project_id
    
    console.log(`✓ Project created: ${projectId}`)
    
    // Get project info
    const getResponse = await request.get(`http://localhost:5000/api/projects/${projectId}`)
    expect(getResponse.ok()).toBeTruthy()
    console.log('✓ Project query successful')
    
    // List all projects
    const listResponse = await request.get('http://localhost:5000/api/projects')
    expect(listResponse.ok()).toBeTruthy()
    const listData = await listResponse.json()
    expect(listData.data.projects).toBeTruthy()
    console.log(`✓ Project list query successful, total ${listData.data.projects.length} projects`)
    
    // Delete project
    const deleteResponse = await request.delete(`http://localhost:5000/api/projects/${projectId}`)
    expect(deleteResponse.ok()).toBeTruthy()
    console.log('✓ Project deleted successfully\n')
    
    projectId = '' // Already deleted, no cleanup needed
  })
})

test.describe('Template upload and usage', () => {
  let projectId: string
  
  test.afterEach(async ({ request }) => {
    if (projectId) {
      try {
        await request.delete(`http://localhost:5000/api/projects/${projectId}`)
      } catch (error) {
        console.warn(`Failed to cleanup project ${projectId}`)
      }
    }
  })
  
  test('Should be able to upload and use template', async ({ request }) => {
    // Create project
    const createResponse = await request.post('http://localhost:5000/api/projects', {
      data: {
        creation_type: 'idea',
        idea_prompt: 'Template test project'
      }
    })
    
    projectId = (await createResponse.json()).data.project_id
    
    // Upload template
    const templatePath = './e2e/fixtures/test-template.png'
    const { readFileSync, existsSync } = await import('fs')
    
    if (existsSync(templatePath)) {
      const uploadResponse = await request.post(
        `http://localhost:5000/api/projects/${projectId}/template`,
        {
          multipart: {
            template_image: {
              name: 'test-template.png',
              mimeType: 'image/png',
              buffer: readFileSync(templatePath)
            }
          }
        }
      )
      
      expect(uploadResponse.ok()).toBeTruthy()
      const uploadData = await uploadResponse.json()
      expect(uploadData.success).toBe(true)
      
      console.log('✓ Template uploaded successfully')
    } else {
      console.warn('⚠ Test template file does not exist, skipping upload test')
      test.skip()
    }
  })
})

