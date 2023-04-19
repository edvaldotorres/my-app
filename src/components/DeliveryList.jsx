import { Button, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function DeliveryList({items, onStatusChange, onDelete, onEdit}) {
    const handleStatusChange = (item, status) => onStatusChange && onStatusChange(item, status);
    const handleDelete = item => onDelete && onDelete(item);
    const handleEdit = item => onEdit && onEdit(item);
           
	return (
		<Table className="mb-0" striped bordered hover responsive>
			<thead>
				<tr>
					<th style={{minWidth: '100px'}}>Título</th>
					<th style={{minWidth: '205px'}}>Descrição</th>
					<th style={{minWidth: '130px'}}>Prazo de entrega</th>
					<th className="text-center">Entregue</th>
                    <th className="text-center">Ações</th>
				</tr>
			</thead>
			<tbody>
                {items.map(item => (
                    <tr key={item?.id}>
                        <td>{item?.title}</td>
                        <td>{item?.description}</td>
                        <td>{item?.delivery_date}</td>
                        <td className="text-center">
                            <Form.Check type="checkbox" checked={item?.is_delivered} onChange={(e) => handleStatusChange(item, e.target.checked)} />
                        </td>
                        <td className="text-center">
                            <Button variant="primary" size="sm" className="m-1" onClick={() => handleEdit(item)}>
                                <FontAwesomeIcon icon={faPencil} />
                            </Button>
                            <Button variant="danger" size="sm" className="m-1" onClick={() => handleDelete(item)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
		</Table>
    );
}
