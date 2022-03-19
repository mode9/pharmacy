import React, {useEffect, useRef, useState} from "react";

import styled from "styled-components";

interface DropdownWrapperProps {
    $open: boolean;
}

interface DropdownItemDotProps {
    $selected: boolean;
    $key: string|number;
}

interface DropdownItemContainerProps {
    $open: boolean;
}

interface ChevronRightProps {
    $open: boolean;
}

type MenuItemInterface = {
    label: string;
    selected: boolean;
    default: boolean;
    key: string | number;
}

const DropdownWrapper = styled.div<DropdownWrapperProps>`
  width: 150px;
  border-radius: 7px;
  background-color: white;
  border: 1px solid #dddbda;
  margin-left: 10px;
  margin-bottom: 10px;
  border-bottom-left-radius: ${props => props.$open ? 0 : '7px'};
  border-bottom-right-radius: ${props => props.$open ? 0 : '7px'};
  position: relative;
`;

const DropdownHeader = styled.div`
  padding: 5px 5px 5px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const DropdownItemContainer = styled.div<DropdownItemContainerProps>`
  padding: 0;
  //border-top: 1px solid #E5E8EC;
  background-color: white;
  border: 1px solid #dddbda;
  width: 150px;
  display: ${props => props.$open ? 'block' : 'none'};
  position: absolute;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  left: -1px;
`;
const DropdownItem = styled.div`
  padding: 10px;
  font-size: 14px;
  transition: background-color 200ms ease-in-out;
  &:not(:last-of-type) {
    border-bottom: 1px solid #dddbda;
  }
  
  &:hover {
    cursor: pointer;
    background-color: #f0f0f0;
  }
`;

const DropdownItemDot = styled.span<DropdownItemDotProps>`
  opacity: ${props => props.$selected ? 1 : 0};
  background-color: #91A5BE;
  transition: all .2s ease-in-out;
  width: 5px;
  height: 5px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 6px;
  margin-bottom: 2px;
`;

const ChevronRight = styled.span<ChevronRightProps>`
  display: inline-block;
  margin-left: auto;
  &:before {
    border-style: solid;
    border-width: 0.1em 0.1em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    //left: 0.15em;
    position: relative;
    top: 0.3em;
    right: 0.3em;
    transform: ${props => props.$open ? 'rotate(135deg)' : 'rotate(45deg)'};
    vertical-align: top;
    width: 0.45em;
    transition: transform 100ms ease-in-out;
  }
`;

function useOutsideHandler (ref: React.RefObject<HTMLElement>): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        function handleClickOutside(e: Event) {
            if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [ref])

    return [open, setOpen];
}

export default function Dropdown () {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useOutsideHandler(dropdownRef);
    const [menuItems, setMenuItems] = useState<MenuItemInterface[]>([
        {
            "label": "가까운 순",
            "selected": true,
            "default": true,
            "key": 'distanceAsc',
        },
        {
            "label": "이름 순",
            "selected": false,
            "default": false,
            "key": 'nameAsc',
        }
    ]);

    function handleClick() {
        setOpen(!open);
    }

    function handleSelect(key: string|number) {
        function inner() {
            setMenuItems((state) => {
                let newState = [...state];
                for (let i=0; i < newState.length; i++) {
                    newState[i].selected = newState[i].key === key;
                }
                return newState;
            })

        }
        return inner;
    }

    // TODO: UI 수정

    return (
        <DropdownWrapper $open={open} onClick={handleClick} ref={dropdownRef}>
            <DropdownHeader>
                {menuItems.filter(item => item.selected)[0].label}
                <ChevronRight $open={open} />
            </DropdownHeader>
            <DropdownItemContainer $open={open}>
                {menuItems.map(item => (
                    <DropdownItem key={item.key} onClick={handleSelect(item.key)}>
                        <DropdownItemDot $selected={item.selected} $key={item.key} />
                        {item.label}
                    </DropdownItem>
                ))}
            </DropdownItemContainer>
        </DropdownWrapper>
    )

}