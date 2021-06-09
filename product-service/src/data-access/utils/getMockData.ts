import * as mockData from "../mockData.json";
import { Product } from "../../models/Product";

export const getMockData = (): Product[] => JSON.parse(JSON.stringify(mockData)).default;