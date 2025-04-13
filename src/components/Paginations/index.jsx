import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginations = ({ totalCount, currentPage, changePage }) => {
    console.log("totalPages",totalCount)
    const totalPages = Math.ceil(totalCount); // Assuming 10 items per page

    const handlePageChange = (page) => {
        changePage(page);
    };

    return (
        <div className="pagination-content center-horizantal mt-2">
            <Pagination className='pagination-section'>
                <Pagination.First className='pagination-first' onClick={() => handlePageChange(1)} />
                <Pagination.Prev  className='pagination-prev'  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item className='pagination-item'
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next className='pagination-next' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last className='pagination-last' onClick={() => handlePageChange(totalPages)} />
            </Pagination>
        </div>
    );
};

export default Paginations;