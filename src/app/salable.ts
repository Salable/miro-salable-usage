import { initSalable } from "@salable/node-sdk";
import {salableApiKey} from "./environment";

export const salable = initSalable(salableApiKey, 'v3')