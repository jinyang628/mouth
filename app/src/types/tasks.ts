import { z } from 'zod';

// This class must match Task from stomach and brain repo
export enum Task {
    SUMMARISE = "summarise",
    PRACTICE = "practice"
}

export const TaskSchema = z.enum([Task.SUMMARISE, Task.PRACTICE]);