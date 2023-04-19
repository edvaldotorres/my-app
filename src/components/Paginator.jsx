import { Pagination } from "react-bootstrap";

export default function Paginator({ currentPage, totalPages, pageLimit, onChangePage }) {
	const handleClick = (pagina) => {
		if (pagina !== currentPage) {
			onChangePage(pagina);
		}
	}

	const paginas = [];
	const inicioPagina = Math.max(1, currentPage - Math.floor(pageLimit / 2));
	const fimPagina = Math.min(totalPages, inicioPagina + pageLimit - 1);
	for (let i = inicioPagina; i <= fimPagina; i++) {
		paginas.push(
			<Pagination.Item
				key={i}
				active={i === currentPage}
				onClick={() => handleClick(i)}
			>
				{i}
			</Pagination.Item>
		);
	}

	return (
		<Pagination className="m-0">
			<Pagination.Prev
				disabled={currentPage === 1}
				onClick={() => handleClick(currentPage - 1)}
			/>
			{paginas}
			<Pagination.Next
				disabled={currentPage === totalPages}
				onClick={() => handleClick(currentPage + 1)}
			/>
		</Pagination>
	);
}
