import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '@/api/endpoints';

// Note: Backend uses 'RUNNING' but we also accept 'PROCESSING' for compatibility
export type ExportTaskStatus = 'PENDING' | 'PROCESSING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type ExportTaskType = 'pptx' | 'pdf' | 'editable-pptx';

export interface ExportTask {
  id: string;
  taskId: string;
  projectId: string;
  type: ExportTaskType;
  status: ExportTaskStatus;
  pageIds?: string[]; // 选中的页面ID列表，undefined表示全部
  progress?: {
    total: number;
    completed: number;
    percent?: number;
    current_step?: string;
    messages?: string[];
  };
  downloadUrl?: string;
  filename?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

interface ExportTasksState {
  tasks: ExportTask[];
  
  // Actions
  addTask: (task: Omit<ExportTask, 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<ExportTask>) => void;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  pollTask: (id: string, projectId: string, taskId: string) => Promise<void>;
}

export const useExportTasksStore = create<ExportTasksState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        set((state) => {
          // Check if task with this id already exists
          const existingIndex = state.tasks.findIndex(t => t.id === task.id);
          
          if (existingIndex >= 0) {
            // Update existing task
            const updatedTasks = [...state.tasks];
            updatedTasks[existingIndex] = {
              ...updatedTasks[existingIndex],
              ...task,
              // Update completedAt if status changed to completed/failed
              completedAt: (task.status === 'COMPLETED' || task.status === 'FAILED')
                ? new Date().toISOString()
                : updatedTasks[existingIndex].completedAt,
            };
            return { tasks: updatedTasks };
          } else {
            // Add new task
            const newTask: ExportTask = {
              ...task,
              createdAt: new Date().toISOString(),
            };
            return {
              tasks: [newTask, ...state.tasks].slice(0, 20), // Keep max 20 tasks
            };
          }
        });
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => task.status !== 'COMPLETED' && task.status !== 'FAILED'
          ),
        }));
      },

      pollTask: async (id, projectId, taskId) => {
        const poll = async () => {
          try {
            const response = await api.getTaskStatus(projectId, taskId);
            const task = response.data;

            if (!task) {
              console.warn('[ExportTasksStore] No task data in response');
              return;
            }

            const updates: Partial<ExportTask> = {
              status: task.status as ExportTaskStatus,
            };

            if (task.progress) {
              // Parse progress if it's a string (from database JSON field)
              let progressData = task.progress;
              if (typeof progressData === 'string') {
                try {
                  progressData = JSON.parse(progressData);
                } catch (e) {
                  console.warn('[ExportTasksStore] Failed to parse progress:', e);
                }
              }
              
              updates.progress = progressData;
              
              // Extract download URL if available
              if (progressData.download_url) {
                updates.downloadUrl = progressData.download_url;
              }
              if (progressData.filename) {
                updates.filename = progressData.filename;
              }
            }

            if (task.status === 'COMPLETED') {
              updates.completedAt = new Date().toISOString();
              get().updateTask(id, updates);
            } else if (task.status === 'FAILED') {
              updates.errorMessage = task.error_message || task.error || '导出失败';
              updates.completedAt = new Date().toISOString();
              get().updateTask(id, updates);
            } else if (task.status === 'PENDING' || task.status === 'RUNNING') {
              get().updateTask(id, updates);
              // Continue polling
              setTimeout(poll, 2000);
            }
          } catch (error: any) {
            console.error('[ExportTasksStore] Poll error:', error);
            get().updateTask(id, {
              status: 'FAILED',
              errorMessage: error.message || '轮询失败',
              completedAt: new Date().toISOString(),
            });
          }
        };

        await poll();
      },
    }),
    {
      name: 'export-tasks-storage',
      partialize: (state) => ({
        // Only persist completed tasks
        tasks: state.tasks.filter(
          (task) => task.status === 'COMPLETED' || task.status === 'FAILED'
        ).slice(0, 10),
      }),
    }
  )
);

