export interface IExceptionProps {
  code?: number;
  status?: number;
  message?: string;
  detail?: string | Record<string, string>;
}
