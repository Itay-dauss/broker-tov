import axios from "axios";
import config from "../config.json";
import { SymbolRequest } from "../types/symbolRequest";

const amazonawsConfig = config.api.amazonaws;

export const getSessionId = async (): Promise<number> => {
  try {
    const response = await axios.post(amazonawsConfig.baseUrl);
    return parseInt(response.data);
  } catch (error) {
    console.error(error);
    return -1;
  }
};

export const getMachinesRequests = async (sessionId: number): Promise<any> => {
  try {
    const response = await axios.get(
      `${amazonawsConfig.baseUrl}/${sessionId}${amazonawsConfig.routes.locates}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSymbolLocatesQantity = async (
  sessionId: number,
  symbolRequest: SymbolRequest
) => {
  try {
    const response = await axios.post(
      `${amazonawsConfig.baseUrl}/${sessionId}${amazonawsConfig.routes.broker}?symbol=${symbolRequest.symbolName}&quantity=${symbolRequest.numOfLocates}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const submitDivision = async (
  sessionId: number,
  dividedLocates: any
) => {
  try {
    await axios.put(
      `${amazonawsConfig.baseUrl}/${sessionId}${amazonawsConfig.routes.locates}`,
      dividedLocates
    );
  } catch (error) {
    console.error(error);
  }
};
