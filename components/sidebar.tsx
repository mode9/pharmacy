import styled from "styled-components";
import {useSelector} from "react-redux";
import {State} from "../core/reducers/types";
import Pharmacy, {filterPharmacies} from "../core/pharmacies";
import React from "react";
import {Mail} from "css.gg/icons/all";
import Dropdown from "./dropdown";


const EMAIL_ADDRESS = 'mode.dev@gmail.com';

const Wrapper = styled.div`
  width: 500px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #000;
  display: none;
  @media screen and (min-width: 1136px) {
    display: flex;
    flex-direction: column;
  }
  overflow: auto;
`;

const Header = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const Footer = styled.div`
  text-align: center;
  margin: 5rem 0 2rem 0;
`

const GridRow = styled.div`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  display: flex;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const GridHeader = styled.div`
  width: 100%;
  padding: 0 1rem;
`

const ContentColumn = styled.div`
  width: 80%;
`;

const ContentTitle = styled.h4`
  margin: 0;
  font-size: 15px;
`;

const ContentDescription = styled.div`
  color: #6B6B6B;
  margin: 0;
  font-size: 12px;
`;

const ContentDescriptionAddress = styled.p`
  width: 67.5%;
`

const ActionColumn = styled.div`
  width: 30%;
`;

const BorderCircle = styled.div`
  border: 1px solid #dddbda;
  border-radius: 50%;
  padding: 10px;
  display: inline-block;
`;

export default function Sidebar () {
    const state = useSelector<State, State>(state => state);
    const pharmacies = state.pharmacies.map(row => new Pharmacy(row));
    const pharmaciesInBounds = filterPharmacies(pharmacies, state.filters);
    const center = state.filters.bounds?.getCenter();

    return (
        <Wrapper id="sidebar" >
            <Header>
                <h2>심야약국</h2>
            </Header>
            {/*<div>*/}
            {/*    <span>영업중인 약국</span>*/}
            {/*</div>*/}
            {/*<GridHeader>*/}
            {/*    <ContentDescription>검색결과 총 15 개</ContentDescription>*/}
            {/*</GridHeader>*/}
            <Dropdown />
            {pharmaciesInBounds.map((row, idx) => (
                <GridRow key={idx}>
                    <ContentColumn>
                        <ContentTitle>{row.name}</ContentTitle>
                        <ContentDescription>
                            <span style={{ width: '35px', display: 'inline-block' }}>{center ? row.humanizedDistance(center) : "알수없음"}</span>
                            <span className="delimiter" style={{padding: '0 2px'}}>&#8226;</span>
                            {/*{row.isOpen(props.isHoliday) ? <AccentDescription>영업 중</AccentDescription> : "영업종료"} &#8226;*/}
                            <span style={{ display: 'inline-block', textAlign: 'left' }}>{row.todayOpeningHour(state.filters.isHoliday).humanizeWorkingHours()}</span>
                            <ContentDescriptionAddress>{(row.address_road || row.address)?.split(' ').splice(1).join(' ')}</ContentDescriptionAddress>
                        </ContentDescription>
                    </ContentColumn>
                    <ActionColumn>
                    </ActionColumn>
                </GridRow>
            ))}
            <Footer>
                <div style={{marginBottom: '1rem'}}>
                    <a href={`mailto:${EMAIL_ADDRESS}?Subject=[심야약국] 문의`}>
                    <BorderCircle >
                        <Mail />
                    </BorderCircle>
                    </a>
                </div>
                <span style={{fontSize: '13px'}}>&copy; mode9</span>
            </Footer>
        </Wrapper>
    )
}