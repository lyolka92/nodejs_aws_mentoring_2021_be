export interface SQSEventMock {
  Records: IRecord[];
}

interface IRecord {
  body: string;
}
