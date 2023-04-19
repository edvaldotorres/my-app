import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const { VITE_API } = import.meta.env;
const MySwal = withReactContent(Swal)

const schema = yup.object({
    title: yup.string().required('Título é obrigatório'),
    description: yup.string().required('Descrição é obrigatória'),
    delivery_date: yup.date().required('Data de entrega é obrigatória')
}).required();

export default function ModalDelivery({item, show, onClose, onSave}) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: item?.title || '',
            description: item?.description || '',
            delivery_date: item?.delivery_date || new Date().toISOString().split('T')[0]
        },
        resolver: yupResolver(schema)
    });

    const onSubmit = async formData => {
        try {
            const request = await fetch(VITE_API.concat(`/v1/deliveries/${item?.id || ''}`), {
                method: item ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    is_delivered: false
                })
            });
            const { data } = await request.json();
            onSave(data);
            onClose();
        } catch (error) {
            console.error(error);
            MySwal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocorreu um erro ao salvar a entrega!'
            });
        }
    }

    return (
        <Modal show={show} onHide={() => onClose()}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>{item ? 'Editar' : 'Nova'} Entrega</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={8}>
                            <Form.Group controlId="formTitle" className="mb-3">
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" {...register('title')} placeholder="Digite o título" isInvalid={!!errors.title} />
                                {errors?.title && <Form.Text className="text-danger">{errors.title.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formDeliveryDate" className="mb-3">
                                <Form.Label>Prazo de entrega</Form.Label>
                                <Form.Control type="date" {...register('delivery_date')} isInvalid={!!errors.delivery_date} />
                                {errors?.delivery_date && <Form.Text className="text-danger">{errors.delivery_date.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control as="textarea" {...register('description')} rows={3} placeholder="Digite a descrição" isInvalid={!!errors.description} />
                        {errors?.description && <Form.Text className="text-danger">{errors.description.message}</Form.Text>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onClose()}>
                        Fechar
                    </Button>
                    <Button variant="primary" type="submit">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}