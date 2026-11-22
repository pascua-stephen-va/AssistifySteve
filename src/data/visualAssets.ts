import workTaskAdjustImg from '../assets/images/work_task_adjust_1794929783504.jpg';
import workTaskScriptImg from '../assets/images/work_task_script_1794929784839.jpg';
import workTaskPulseImg from '../assets/images/work_task_pulse_1794929783144.jpg';
import workDataAnalyticsImg from '../assets/images/work_data_analytics_1794929783684.jpg';
import workScriptSceneImg from '../assets/images/work_script_scene_1794929785172.jpg';
import explorationArchImg from '../assets/images/exploration_architecture_1794929785309.jpg';

export const WORK_IMAGES: Record<string, string> = {
  'task-adjust': workTaskAdjustImg,
  'task-script': workTaskScriptImg,
  'task-pulse': workTaskPulseImg,
  'da-101': workDataAnalyticsImg,
  'script-to-scene': workScriptSceneImg,
};

export const VISUAL_GALLERY_IMAGES = {
  adjust: workTaskAdjustImg,
  script: workTaskScriptImg,
  pulse: workTaskPulseImg,
  analytics: workDataAnalyticsImg,
  scene: workScriptSceneImg,
  arch: explorationArchImg,
};

export const EXPLORATION_ITEMS = [
  {
    id: 'exp-1',
    title: 'Precision Ledger Geometry',
    subtitle: 'TaskAdjust Calculation Matrix',
    year: '2026',
    imageKey: 'adjust' as const,
    rotation: '-rotate-2',
  },
  {
    id: 'exp-2',
    title: 'Modular Workflow Grid',
    subtitle: 'TaskScript Procedural Architecture',
    year: '2026',
    imageKey: 'script' as const,
    rotation: 'rotate-2',
  },
  {
    id: 'exp-3',
    title: 'Harmonic SLA Pulse',
    subtitle: 'TaskPulse Retention Telemetry',
    year: '2026',
    imageKey: 'pulse' as const,
    rotation: 'rotate-1',
  },
  {
    id: 'exp-4',
    title: 'Relational Schema Study',
    subtitle: 'Data Analytics 101 Sandbox',
    year: '2026',
    imageKey: 'analytics' as const,
    rotation: '-rotate-2',
  },
  {
    id: 'exp-5',
    title: 'Anamorphic Prompt Rig',
    subtitle: 'A Script 2 Scene Studio',
    year: '2026',
    imageKey: 'scene' as const,
    rotation: '-rotate-1',
  },
  {
    id: 'exp-6',
    title: 'Structural Systems Study',
    subtitle: 'Enterprise Operations Monograph',
    year: '2026',
    imageKey: 'arch' as const,
    rotation: 'rotate-2',
  },
];
