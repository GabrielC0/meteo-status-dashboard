export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  maxVisible?: number;
  horsContractList?: string[];
  onHorsContratChange?: (show: boolean) => void;
};
