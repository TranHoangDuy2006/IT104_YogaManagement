export interface ServiceInput {
  name: string;
  description: string;
  imageUrl: string;
}

export function validateServiceInput(service: ServiceInput): string | null {
  if (!service.name.trim() || !service.description.trim() || !service.imageUrl.trim()) {
    return "Vui lòng điền đầy đủ thông tin dịch vụ!";
  }
  return null;
}
