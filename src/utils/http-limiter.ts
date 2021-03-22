import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { HttpsAgent } from 'agentkeepalive';

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 333,
});

const httpsConfig = {
  maxSockets: 1,
  maxFreeSockets: 1,
  timeout: 60000,
  freeSocketTimeout: 60000,
};

const agent = new HttpsAgent(httpsConfig);
axios.defaults.httpsAgent = agent;

export async function get<T>(path: string): Promise<AxiosResponse<T>> {
  return limiter.schedule(() => axios.get<T>(path));
}
