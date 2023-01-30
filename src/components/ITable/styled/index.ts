import styled from 'styled-components'

export const TableContainerStyled = styled.div`
  .itable-editable-cell {
    position: relative;
  }

  .itable-editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .itable-editable-row:hover .itable-editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }

  [data-theme='dark']
    .itable-editable-row:hover
    .itable-editable-cell-value-wrap {
    border: 1px solid #434343;
  }

  .${({ theme }) => theme.prefix || 'ant'}-table-cell {
    .${({ theme }) => theme.prefix || 'ant'}-typography {
      user-select: none;
    }
  }
`
