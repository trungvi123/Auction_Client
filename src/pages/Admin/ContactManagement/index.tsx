import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import userApi from '../../../api/userApi';
import ContactTable from '../../../components/Admin/ContactTable'

const ContactManagement = () => {
  const [typeList, setTypeList] = useState("new");
    
    const contact_list = useQuery({
        queryKey: ["contact-list", { typeList }],
        queryFn: async () => {
          let result: any;
          if (typeList === "new") {
            result = await userApi.getNewContact()
          }else {
            result = await userApi.getContactReply()
          }
          return result.data;
        },
        staleTime: 240 * 1000,
      });

      

  return (
    <Container>
      <Row className="mt-5 justify-content-end">
        <Col sm={4} className={"my-4"}>
          <Form.Select
            onChange={(e: any) => setTypeList(e.target.value)}
            aria-label="Default select example"
          >
            <option value="new">Liên hệ chưa được trả lời</option>
            <option value="old">Liên hệ đã được trả lời</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <ContactTable data={contact_list?.data || []}></ContactTable>
        </Col>
      </Row>
     
    </Container>
  )
}

export default ContactManagement