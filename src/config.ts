/// <reference types="./envsub" />
import envsub from 'envsub';
import fs from 'fs';

export interface Service {
  type: string;
  deviceLabel?: string;
  token?: string;
  url: string;
  headers?: { [key: string]: string }
}

export interface Config {
  serverPath?: string;
  services: [Service];
}

interface EnvsubResult {
  templateFile: string;
  templateContents: string;
  outputFile: string;
  outputContents: string;
}

export default async (templateFile = `${__dirname}/../../config.json`): Promise<Config> => {
  if (!fs.existsSync(templateFile)) {
    throw new Error(`Template file ${templateFile} does not exist.`);
  }
  const result: EnvsubResult = await envsub({ templateFile, outputFile: '/dev/null' });
  const config: Config = JSON.parse(result.outputContents);
  return config;
};
