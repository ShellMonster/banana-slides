import React, { useState, useEffect } from 'react';
import { Download, X, Trash2, FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useExportTasksStore, type ExportTask, type ExportTaskType } from '@/store/useExportTasksStore';
import type { Page } from '@/types';
import { Button } from './Button';
import { cn } from '@/utils';

const taskTypeLabels: Record<ExportTaskType, string> = {
  'pptx': 'PPTX',
  'pdf': 'PDF',
  'editable-pptx': '可编辑 PPTX',
};

/**
 * 计算页数范围显示文本
 * @param pageIds 选中的页面ID列表，undefined表示全部
 * @param pages 所有页面列表
 * @returns 页数范围文本，如"全部"、"第1-3页"、"第2页"
 */
const getPageRangeText = (pageIds: string[] | undefined, pages: Page[]): string => {
  if (!pageIds || pageIds.length === 0) {
    return '全部';
  }
  
  // 找到所有页面的索引
  const indices: number[] = [];
  pageIds.forEach(pageId => {
    const index = pages.findIndex(p => (p.id || p.page_id) === pageId);
    if (index >= 0) {
      indices.push(index);
    }
  });
  
  if (indices.length === 0) {
    return `${pageIds.length}页`;
  }
  
  indices.sort((a, b) => a - b);
  const minIndex = indices[0];
  const maxIndex = indices[indices.length - 1];
  
  // 如果是连续的，显示范围；否则显示数量
  if (indices.length === maxIndex - minIndex + 1) {
    // 连续范围
    if (minIndex === maxIndex) {
      return `第${minIndex + 1}页`;
    }
    return `第${minIndex + 1}-${maxIndex + 1}页`;
  } else {
    // 不连续，显示数量
    return `${pageIds.length}页`;
  }
};

const TaskStatusIcon: React.FC<{ status: ExportTask['status'] }> = ({ status }) => {
  switch (status) {
    case 'PENDING':
      return <Clock size={16} className="text-gray-400" />;
    case 'PROCESSING':
    case 'RUNNING':
      return <Loader2 size={16} className="text-banana-500 animate-spin" />;
    case 'COMPLETED':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'FAILED':
      return <XCircle size={16} className="text-red-500" />;
    default:
      return null;
  }
};

const TaskItem: React.FC<{ task: ExportTask; pages: Page[]; onRemove: () => void }> = ({ task, pages, onRemove }) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const pageRangeText = getPageRangeText(task.pageIds, pages);

  // 计算进度百分比
  const getProgressPercent = () => {
    if (!task.progress) return 0;
    if (task.progress.percent !== undefined) return task.progress.percent;
    if (task.progress.total > 0) {
      return Math.round((task.progress.completed / task.progress.total) * 100);
    }
    return 0;
  };

  const progressPercent = getProgressPercent();
  const isProcessing = task.status === 'PROCESSING' || task.status === 'RUNNING' || task.status === 'PENDING';

  return (
    <div className="flex items-start gap-3 py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-0.5">
        <TaskStatusIcon status={task.status} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700 truncate">
            {taskTypeLabels[task.type]}
          </span>
          <span className="text-xs text-gray-500">
            {pageRangeText}
          </span>
          <span className="text-xs text-gray-400">
            {formatTime(task.createdAt)}
          </span>
        </div>
        
        {/* 进度条 - 显示在进行中的任务 */}
        {isProcessing && (
          <div className="mt-2 space-y-1.5">
            {task.progress ? (
              <>
                {/* 进度百分比和当前步骤 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-banana-600">
                    {progressPercent > 0 ? `${progressPercent}%` : '准备中...'}
                  </span>
                  {task.progress.current_step && (
                    <span className="text-xs text-gray-500 truncate max-w-[140px]" title={task.progress.current_step}>
                      {task.progress.current_step}
                    </span>
                  )}
                </div>
                
                {/* 进度条 */}
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-banana-500 to-banana-600 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                {/* 显示消息日志（如果有） */}
                {task.progress.messages && task.progress.messages.length > 0 && (
                  <div className="mt-1.5 space-y-0.5">
                    {task.progress.messages.slice(-2).map((msg, idx) => (
                      <div key={idx} className="text-xs text-gray-500 truncate" title={msg}>
                        {msg}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-banana-500 animate-pulse" style={{ width: '30%' }} />
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">等待中...</span>
              </div>
            )}
          </div>
        )}
        
        {task.status === 'FAILED' && task.errorMessage && (
          <p className="text-xs text-red-500 mt-1 truncate" title={task.errorMessage}>
            {task.errorMessage}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        {task.status === 'COMPLETED' && task.downloadUrl && (
          <Button
            variant="primary"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => window.open(task.downloadUrl, '_blank')}
            className="text-xs px-2 py-1"
          >
            下载
          </Button>
        )}
        
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="移除"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

interface ExportTasksPanelProps {
  projectId?: string;
  pages?: Page[];
  className?: string;
}

export const ExportTasksPanel: React.FC<ExportTasksPanelProps> = ({ projectId, pages = [], className }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { tasks, removeTask, clearCompleted } = useExportTasksStore();
  
  // Filter tasks for current project if projectId is provided
  const filteredTasks = projectId 
    ? tasks.filter(task => task.projectId === projectId)
    : tasks;
  
  const activeTasks = filteredTasks.filter(
    task => task.status === 'PENDING' || task.status === 'PROCESSING' || task.status === 'RUNNING'
  );
  const completedTasks = filteredTasks.filter(
    task => task.status === 'COMPLETED' || task.status === 'FAILED'
  );
  
  // 当有进行中的任务时，自动展开面板
  useEffect(() => {
    if (activeTasks.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [activeTasks.length, isExpanded]);
  
  if (filteredTasks.length === 0) {
    return null;
  }
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden",
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            导出任务
          </span>
          {activeTasks.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-banana-100 text-banana-700 rounded-full">
              {activeTasks.length} 进行中
            </span>
          )}
        </div>
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {/* Active tasks */}
          {activeTasks.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              {activeTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  pages={pages}
                  onRemove={() => removeTask(task.id)}
                />
              ))}
            </div>
          )}
          
          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-1 mb-1">
                <span className="text-xs text-gray-400">历史记录</span>
                <button
                  onClick={clearCompleted}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  清除
                </button>
              </div>
              {completedTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  pages={pages}
                  onRemove={() => removeTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

