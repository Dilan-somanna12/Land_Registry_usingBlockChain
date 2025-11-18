import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiEye, FiCheck, FiX, FiClock, FiDollarSign } from 'react-icons/fi'

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
`

const TableHeader = styled.thead`
  background: #f9fafb;
`

const HeaderRow = styled.tr``

const HeaderCell = styled.th`
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  &:first-child {
    border-radius: 8px 0 0 8px;
  }
  
  &:last-child {
    border-radius: 0 8px 8px 0;
  }
`

const TableBody = styled.tbody``

const DataRow = styled(motion.tr)`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`

const DataCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #1f2937;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  
  &:first-child {
    border-left: 1px solid #f3f4f6;
    border-radius: 8px 0 0 8px;
  }
  
  &:last-child {
    border-right: 1px solid #f3f4f6;
    border-radius: 0 8px 8px 0;
  }
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    switch(props.status) {
      case 'Approved':
      case 'Available':
        return `
          background: #d1fae5;
          color: #065f46;
        `
      case 'Pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `
      case 'Not Approved':
      case 'Rejected':
        return `
          background: #fee2e2;
          color: #991b1b;
        `
      default:
        return `
          background: #e5e7eb;
          color: #4b5563;
        `
    }
  }}
`

const ActionButton = styled(motion.button)`
  padding: 8px 16px;
  background: ${props => props.primary ? '#4f46e5' : '#f3f4f6'};
  color: ${props => props.primary ? 'white' : '#4b5563'};
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  margin-right: 8px;
  
  &:hover {
    background: ${props => props.primary ? '#4338ca' : '#e5e7eb'};
  }
  
  &:last-child {
    margin-right: 0;
  }
  
  svg {
    font-size: 14px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`

const EmptyText = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`

const PriceTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: #059669;
`

export const ModernTable = ({ columns, data, onAction, emptyMessage }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved':
      case 'Available':
        return <FiCheck />
      case 'Pending':
        return <FiClock />
      case 'Not Approved':
      case 'Rejected':
        return <FiX />
      default:
        return null
    }
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon><FiEye /></EmptyIcon>
        <EmptyText>{emptyMessage || 'No data available'}</EmptyText>
      </EmptyState>
    )
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHeader>
          <HeaderRow>
            {columns.map((col) => (
              <HeaderCell key={col.id}>{col.label}</HeaderCell>
            ))}
          </HeaderRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <DataRow
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {columns.map((col) => {
                if (col.id === 'actions') {
                  return (
                    <DataCell key={col.id}>
                      {col.render ? col.render(row) : null}
                    </DataCell>
                  )
                }
                
                if (col.id === 'status') {
                  const status = row[col.id]
                  return (
                    <DataCell key={col.id}>
                      <StatusBadge status={status}>
                        {getStatusIcon(status)}
                        {status}
                      </StatusBadge>
                    </DataCell>
                  )
                }
                
                if (col.id === 'lamount' || col.id === 'price') {
                  return (
                    <DataCell key={col.id}>
                      <PriceTag>
                        <FiDollarSign />
                        {row[col.id]} ETH
                      </PriceTag>
                    </DataCell>
                  )
                }
                
                return (
                  <DataCell key={col.id}>
                    {col.render ? col.render(row[col.id], row) : row[col.id]}
                  </DataCell>
                )
              })}
            </DataRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  )
}

export { ActionButton }


