import React, {useEffect, useRef, useState} from "react";

import styled from "styled-components";
import {useStore} from "react-redux";
import {changeSorting} from "../core/reducers/pharmacies";
import {ChevronRight} from "./chevron";

interface DropdownWrapperProps {
    $open: boolean;
    $mini: boolean;
}

interface DropdownItemDotProps {
    $selected: boolean;
    $key: string|number;
}

interface DropdownItemContainerProps {
    $open: boolean;
}

type MenuItemInterface = {
    label: string;
    selected: boolean;
    default: boolean;
    key: string;
}

const DropdownWrapper = styled.div<DropdownWrapperProps>`
  width: ${props => props.$mini ? '75px' : '150px' };
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
  z-index: 1;
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

export default function Dropdown ({ mini }: {mini: boolean}) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useOutsideHandler(dropdownRef);
    const store = useStore();
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

    function handleSelect(item: MenuItemInterface) {
        function inner() {
            setMenuItems((state) => {
                let newState = [...state];
                for (let i=0; i < newState.length; i++) {
                    newState[i].selected = newState[i].key === item.key;
                }
                return newState;
            })
            store.dispatch(changeSorting(item.key));
        }
        return inner;
    }

    // TODO: UI 수정

    return (
        <DropdownWrapper $open={open} onClick={handleClick} ref={dropdownRef} $mini={mini}>
            <DropdownHeader>
                {menuItems.filter(item => item.selected)[0].label}
                <ChevronRight $open={open} />
            </DropdownHeader>
            <DropdownItemContainer $open={open}>
                {menuItems.map(item => (
                    <DropdownItem key={item.key} onClick={handleSelect(item)}>
                        <DropdownItemDot $selected={item.selected} $key={item.key} />
                        {item.label}
                    </DropdownItem>
                ))}
            </DropdownItemContainer>
        </DropdownWrapper>
    )

}

Dropdown.defaultProps = {
    mini: false,
}