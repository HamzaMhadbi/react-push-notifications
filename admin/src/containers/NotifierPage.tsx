import { Row, Col } from 'reactstrap';

import { NotifierForm } from '../components/NotifierForm';

export const NotifierPage = (): JSX.Element => {
  return (
    <div id="app-container">
      <h1 className="mb-sm-3">Web Push Admin</h1>
      <Row>
        <Col sm="12" className="form-container">
          <NotifierForm />
        </Col>
      </Row>
    </div>
  );
};
