import { Col, NavLink, Row, Spinner } from 'reactstrap';
import { gql, useQuery } from '@apollo/client';

import { PROFILE_FORM_FRAGMENT, ProfileForm } from '../components/ProfileForm';
import { PROFILE_TOPICS_FRAGMENT, Topics } from '../components/Topics';
import { FCM } from '../components/FCM';

import { Profile } from '../__generated__/graphql';

const ME = gql`
  ${PROFILE_FORM_FRAGMENT}
  ${PROFILE_TOPICS_FRAGMENT}
  query {
    me {
      ...ProfileFormFragment
      ...ProfileTopicsFragment
    }
  }
`;

export const ProfilePage = (): JSX.Element => {
  const { loading, data, updateQuery } = useQuery<{ me: Profile }>(ME);
  const profile = data?.me;
  return (
    <div id="app-container">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="mb-sm-3">Web Push Notifications</h1>
        <NavLink href={process.env.REACT_APP_ADMIN_URI} target="_blank">
          Use Admin Notifier to send notifications
        </NavLink>
      </div>
      <Row>
        {loading ? (
          <Col sm={12} className="p-sm-5 text-center">
            <Spinner size="sm" color="primary" type="grow" />
          </Col>
        ) : (
          <>
            <Col md="5" sm="12" className="page-column">
              <ProfileForm profile={profile} updateQuery={updateQuery} />
            </Col>
            <Col md="6" sm="12" className="page-column">
              <FCM profile={profile} />
              <Topics topics={profile?.topics ?? []} />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};
