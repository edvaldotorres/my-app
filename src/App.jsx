import { Button, Card } from "react-bootstrap";
import style from "./styles/App.module.scss";  
import clsx from "clsx";
import DeliveryList from "./components/DeliveryList";
import ModalDelivery from "./components/ModalDelivery";
import { useEffect, useState } from "react";
import Paginator from "./components/Paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const { VITE_API } = import.meta.env;
const MySwal = withReactContent(Swal)

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deliveries, setDeliveries] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const loadDeliveries = async (page) => {
    try {
        const request = await fetch(VITE_API.concat(`/v1/deliveries?page=${page || 1}`));
        const { data, meta } = await request.json();
        setDeliveries(data || []);
        setTotalPages(meta?.last_page || 1);
        setTotalItems(meta?.total || 0);
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocorreu um erro ao carregar as entregas!'
      });
    }
  }

  const handleClose = () => {
    setShowModal(false);
    setModalItem(null);
  }

  const handleSave = async item => {
    await loadDeliveries();
    handleClose();
  }

  const handleChangePage = async page => {
    await loadDeliveries(page);
    setCurrentPage(page);
  }

  const handleEdit = item => {
    setModalItem(item);
    setShowModal(true);
  }

  const handleStatusChange = async (item, status) => {
    try {
      await fetch(VITE_API.concat(`/v1/deliveries/${item?.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_delivered: status
        })
      });
      await loadDeliveries(currentPage);
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocorreu um erro ao atualizar a entrega!'
      });
    }
  }

  const handleDelete = async item => {
    MySwal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter essa ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await fetch(VITE_API.concat(`/v1/deliveries/${item?.id}`), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        await loadDeliveries(currentPage);
        setTotalPages(meta?.last_page || 1);
      } catch (error) {
          console.error(error);
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocorreu um erro ao deletar a entrega!'
          });
      }
    })
  }

  useEffect(() => {
    loadDeliveries();
  }, []);

	return (
    <div className={clsx(style.appContainer, 'p-3')}>
      <div className="d-flex justify-content-end pb-3">
        <Button variant="primary" onClick={() => loadDeliveries()}>
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
        <Button
          variant="success"
          className="ms-2"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nova entrega
        </Button>
      </div>

        <Card className="w-100">
          <Card.Header>
            <Card.Title className="m-0">
              Lista de entregas ({totalItems})
            </Card.Title>
          </Card.Header>
          <Card.Body className="p-0">
            <DeliveryList
              items={deliveries}
              onStatusChange={(item, status) => handleStatusChange(item, status)}
              onDelete={item => handleDelete(item)}
              onEdit={item => handleEdit(item)}
            />
          </Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-center">
              <Paginator
                currentPage={currentPage}
                totalPages={totalPages}
                pageLimit={5}
                onChangePage={handleChangePage}
              />
            </div>
          </Card.Footer>
        </Card>

        {showModal && <ModalDelivery
          show={showModal}
          item={modalItem}
          onClose={handleClose}
          onSave={item => handleSave(item)}
        />}
    </div>
	);
}
