/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export enum Gender {
  Female = 'female',
  Male = 'male'
}

export type Mutation = {
  __typename?: 'Mutation';
  notify?: Maybe<Scalars['Boolean']['output']>;
  putProfile?: Maybe<Profile>;
  updateFCMToken?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationNotifyArgs = {
  notificationContext: NotificationContextInput;
};


export type MutationPutProfileArgs = {
  profile: ProfileInput;
};


export type MutationUpdateFcmTokenArgs = {
  fcmToken: Scalars['String']['input'];
};

export type NotificationContextInput = {
  condition?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  notification: NotificationInput;
  uids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type NotificationInput = {
  badge?: InputMaybe<Scalars['String']['input']>;
  body: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  requireInteraction?: InputMaybe<Scalars['Boolean']['input']>;
  silent?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
  vibrate?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Profile = {
  __typename?: 'Profile';
  age: Scalars['Int']['output'];
  country: Scalars['String']['output'];
  fcmToken?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  gender: Gender;
  id: Scalars['ID']['output'];
  role: Role;
  topics?: Maybe<Array<Topic>>;
};

export type ProfileInput = {
  age: Scalars['Int']['input'];
  country: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  gender: Gender;
  id: Scalars['ID']['input'];
  role: Role;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<Profile>;
  profile?: Maybe<Profile>;
  profiles?: Maybe<Array<Profile>>;
};


export type QueryProfileArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Developer = 'developer',
  Manager = 'manager',
  Student = 'student'
}

export type Topic = {
  __typename?: 'Topic';
  description: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type UpdateFcmTokenMutationVariables = Exact<{
  fcmToken: Scalars['String']['input'];
}>;


export type UpdateFcmTokenMutation = { __typename?: 'Mutation', updateFCMToken?: boolean | null };

export type ProfileFormFragmentFragment = (
  { __typename?: 'Profile', id: string, fullName: string, role: Role, gender: Gender, age: number, country: string }
  & { ' $fragmentRefs'?: { 'ProfileTopicsFragmentFragment': ProfileTopicsFragmentFragment } }
) & { ' $fragmentName'?: 'ProfileFormFragmentFragment' };

export type PutProfileMutationVariables = Exact<{
  profile: ProfileInput;
}>;


export type PutProfileMutation = { __typename?: 'Mutation', putProfile?: (
    { __typename?: 'Profile' }
    & { ' $fragmentRefs'?: { 'ProfileFormFragmentFragment': ProfileFormFragmentFragment } }
  ) | null };

export type ProfileTopicsFragmentFragment = { __typename?: 'Profile', topics?: Array<{ __typename?: 'Topic', value: string, description: string }> | null } & { ' $fragmentName'?: 'ProfileTopicsFragmentFragment' };

export const ProfileTopicsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileTopicsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<ProfileTopicsFragmentFragment, unknown>;
export const ProfileFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileTopicsFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileTopicsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<ProfileFormFragmentFragment, unknown>;
export const UpdateFcmTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateFCMToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fcmToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFCMToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fcmToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fcmToken"}}}]}]}}]} as unknown as DocumentNode<UpdateFcmTokenMutation, UpdateFcmTokenMutationVariables>;
export const PutProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"putProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"putProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileFormFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileTopicsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileTopicsFragment"}}]}}]} as unknown as DocumentNode<PutProfileMutation, PutProfileMutationVariables>;