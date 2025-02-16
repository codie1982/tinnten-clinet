import React from 'react';
import { Pagination } from 'react-bootstrap'
const Paginations = ({ totalCount, currentPage, changePage }) => {
    console.log("totalPages",totalCount)
    const totalPages = Math.ceil(totalCount); // Assuming 10 items per page

    const handlePageChange = (page) => {
        changePage(page);
    };

    return (
        <div className="center-horizantal mt-2">
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} />
            </Pagination>
        </div>
    );
};

export default Paginations;