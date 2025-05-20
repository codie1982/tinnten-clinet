import React, { useState } from 'react';
import { Dropdown } from "react-bootstrap";

export default function CompanyDropup({ companies, onSelectCompany }) {
  if (!companies || companies.length === 0) return null;

  return (
    <Dropdown drop="up" className="company-dropup">
      <Dropdown.Toggle variant="dark" className="company-toggle">
        <img
          src={companies[0].logo?.path}
          alt="logo"
          className="company-logo"
        />
        <span className="company-name">{companies[0].companyName}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="company-menu">
        {companies.map((company) => (
          <Dropdown.Item
            key={company._id}
            onClick={() => onSelectCompany(company)}
            className="company-item"
          >
            <img
              src={company.logo?.path}
              alt="logo"
              className="company-logo"
            />
            <div className="company-details">
              <div className="name">{company.companyName}</div>
              <div className="website">
                {company.website?.replace(/^https?:\/\//, "")}
              </div>
            </div>
          </Dropdown.Item>
        ))}

      </Dropdown.Menu>
    </Dropdown>
  );
}
