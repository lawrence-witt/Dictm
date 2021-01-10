import React from 'react';
import styled from 'styled-components';

// Styled

const Header = styled.header`
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background: #6200EE;
`;

// Component

const AppBar: React.FC = (props): React.ReactElement => {
    return (
        <Header>
            {props.children}
        </Header>
    )
};

// Exports

export default AppBar;