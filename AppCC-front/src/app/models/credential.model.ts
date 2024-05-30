export class Credential {
  type: string | '';
  value!: string | '';
  constructor(type?: string, value?: string) {
    this.type = type || '';
    this.value = value || '';
  }
  public get_attributes(): string {
    return this.type + ' ' + this.value;
  }
  public get_type(): string {
    return this.type;
  }
  public get_value(): string {
    return this.value;
  }
  public set_type(type: string): void {
    this.type = type;
  }
  public set_value(value: string): void {
    this.value = value;
  }
  public set_attributes(type: string, value: string): void {
    this.type = type;
    this.value = value;
  }
}
