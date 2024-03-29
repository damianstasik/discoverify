export interface Attribute<Value> {
  min: Value | null;
  target: Value | null;
  max: Value | null;
}

export interface User {
  email: string;
  photoUrl: string;
  displayName: string;
}
