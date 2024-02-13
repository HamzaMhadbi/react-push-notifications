import {
  OperationVariables,
  WatchQueryOptions,
  gql,
  useMutation,
} from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import { toast } from 'react-toastify';

import { countryList, setCookie } from '../utils';
import { Gender, Profile, ProfileInput, Role } from '../__generated__/graphql';

import { PROFILE_TOPICS_FRAGMENT } from './Topics';

export const PROFILE_FORM_FRAGMENT = gql`
  ${PROFILE_TOPICS_FRAGMENT}
  fragment ProfileFormFragment on Profile {
    id
    fullName
    role
    gender
    age
    country
    ...ProfileTopicsFragment
  }
`;

const PUT_PROFILE = gql`
  ${PROFILE_FORM_FRAGMENT}
  mutation putProfile($profile: ProfileInput!) {
    putProfile(profile: $profile) {
      ...ProfileFormFragment
    }
  }
`;

interface Props {
  profile: Profile;
  updateQuery<TVars extends OperationVariables = OperationVariables>(
    mapFn: (
      previousQueryResult: {
        me: Profile;
      },
      options: Pick<
        WatchQueryOptions<
          TVars,
          {
            me: Profile;
          }
        >,
        'variables'
      >,
    ) => {
      me: Profile;
    },
  ): void;
}

export const ProfileForm = ({
  profile,
  updateQuery,
}: Readonly<Props>): JSX.Element => {
  const [profileInput, setProfileInput] = useState<ProfileInput>({
    fullName: profile.fullName,
    role: profile.role,
    gender: profile.gender,
    country: profile.country,
    age: profile.age,
    id: profile.id ?? uuidv4(),
  } as ProfileInput);

  const onFullNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileInput((oldProfileInput) => ({
        ...oldProfileInput,
        fullName: `${e.target.value.charAt(0).toUpperCase()}${e.target.value.substring(1)}`,
      }));
    },
    [],
  );

  const onRoleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileInput((oldProfileInput) => ({
      ...oldProfileInput,
      role: e.target.value as Role,
    }));
  }, []);

  const onGenderChange = useCallback((e: any) => {
    setProfileInput((oldProfileInput) => ({
      ...oldProfileInput,
      gender: e.target.value as Gender,
    }));
  }, []);

  const onAgeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileInput((oldProfileInput) => ({
      ...oldProfileInput,
      age: Number.parseInt(e.target.value) ?? 18,
    }));
  }, []);

  const onCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileInput((oldProfileInput) => ({
        ...oldProfileInput,
        country: e.target.value,
      }));
    },
    [],
  );

  const [putProfile, { loading }] = useMutation(PUT_PROFILE);

  const btnDisabled = useMemo(() => {
    return (
      !profileInput.fullName ||
      !profileInput.role ||
      !profileInput.gender ||
      !profileInput.age ||
      !profileInput.country ||
      loading
    );
  }, [profileInput, loading]);

  const handleCutomizeProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { data } = await putProfile({
        variables: {
          profile: profileInput,
        },
      });
      if (data) {
        setCookie('uid', profileInput.id);
        updateQuery(({ me }) => ({
          me: {
            ...me,
            ...data.putProfile,
          },
        }));
        toast.success('Profile successfully updated');
      } else toast.error('Sorry something went wrong');
    },
    [putProfile, profileInput, updateQuery],
  );

  return (
    <Card>
      <CardBody>
        <Badge className="mb-3" color="primary" pill={false}>
          Step 1
        </Badge>
        <CardTitle tag="h3" className="mb-3">
          Customize your profile
        </CardTitle>
        <Form onSubmit={handleCutomizeProfile}>
          <FormGroup>
            <Label for="fullName">
              <span className="text-danger">*</span> Full Name
            </Label>
            <Input
              id="fullName"
              className="text-capitalize"
              type="text"
              placeholder="Full Name"
              maxLength={38}
              defaultValue={profileInput.fullName}
              onChange={onFullNameChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="role">
              <span className="text-danger">*</span> Role
            </Label>
            <Input
              id="role"
              type="select"
              placeholder="Role"
              maxLength={38}
              defaultValue={profileInput.role}
              onChange={onRoleChange}
              required>
              <option value=""></option>
              {Object.entries(Role).map(([label, value]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col sm="12">
                <Label for="gender">
                  <span className="text-danger">*</span> I'm a{' '}
                  {profileInput.gender === Gender.Male ? 'Boy' : 'Girl'}
                </Label>
              </Col>
              <ButtonGroup className="ml-5" onClick={onGenderChange}>
                <Button type="button" color="primary" value={Gender.Male}>
                  Boy
                </Button>
                <Button type="button" color="danger" value={Gender.Female}>
                  Girl
                </Button>
              </ButtonGroup>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label for="age">
              <span className="text-danger">*</span> Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Age"
              min={18}
              max={100}
              defaultValue={profileInput.age}
              onChange={onAgeChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="country">
              <span className="text-danger">*</span> From
            </Label>
            <Input
              id="country"
              name="select"
              type="select"
              defaultValue={profileInput.country}
              onChange={onCountryChange}
              required>
              {countryList.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup className="mt-5 pull-right">
            <Button
              className="float-right"
              type="submit"
              color="primary"
              outline
              disabled={btnDisabled}>
              {loading && (
                <Spinner className="mr-2" size="sm" color="primary" />
              )}
              Customize
            </Button>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

ProfileForm.defaultProps = {
  profile: {
    fullName: '',
    role: '',
    country: 'France',
    age: 33,
    gender: Gender.Male,
  },
};
