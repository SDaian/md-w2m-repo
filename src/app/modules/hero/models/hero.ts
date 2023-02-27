export enum Gender {
  FEMALE = 'female',
  MALE = 'male'
}

export interface Hero {
  id?: number;
  nameLabel: string;
  genderLabel: Gender;
  citizenshipLabel: string;
  occupationLabel: string;
}

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  CANCEL = 'cancel',
}

export interface ModalObject {
  hero: Hero;
  action?: Action;
}
