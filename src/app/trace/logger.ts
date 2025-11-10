import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

const endpoint = "https://otlp-gateway-prod-sa-east-1.grafana.net/otlp" 
const header = "Basic MTQxNzA3MzpnbGNfZXlKdklqb2lNVFUzTURneU5pSXNJbTRpT2lKdVpYTjBMV0poYzJVdGJtVnpkQzFuWlhKaFpHOXlJaXdpYXlJNkltdzRkbkowZVRoemNqZzFOekJpZWpKS2RUbExSMU16T1NJc0ltMGlPbnNpY2lJNkluQnliMlF0YzJFdFpXRnpkQzB4SW4xOQ=="

export const logExporter = new OTLPLogExporter({
  url: endpoint + "/v1/logs",
  headers: {
    Authorization: header,
  },
});
