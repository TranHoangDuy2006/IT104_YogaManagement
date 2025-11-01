import type { Service } from "./Service";

export interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, "id">) => void;
  service?: Service | null;
}
