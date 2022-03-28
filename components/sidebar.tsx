import styled from "styled-components";
import {useSelector, useStore} from "react-redux";
import {State} from "../core/reducers/types";
import Pharmacy, {filterPharmacies} from "../core/pharmacies";
import React, {MouseEventHandler} from "react";
import {Controller, Mail} from "css.gg/icons/all";
import Dropdown from "./dropdown";
import {RootState} from "../core/reducers";
import {activatePharmacy, selectPharmacy} from "../core/reducers/selector";
import {Location} from "./icons/location";
import {HoverContainer} from "./icons/base";


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
  margin: 4rem 0 2rem 0;
`

const GridRow = styled.div`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  display: flex;
  //cursor: pointer;
  //&:hover {
  //  background-color: #f0f0f0;
  //}
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
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContentDescription = styled.div`
  color: #6B6B6B;
  margin: 0;
  font-size: 12px;
`;

const ContentDescriptionAddress = styled.p`
  width: 100%;
`

const ActionColumn = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: right;
`;

const BorderCircle = styled.div`
  border: 1px solid #dddbda;
  border-radius: 50%;
  padding: 10px;
  display: inline-block;
  text-align: center;
  
  
`;

export default function Sidebar () {
    const state = useSelector<RootState, State>(state => state.pharmacies);
    const pharmacies = state.pharmacies;
    const pharmaciesInBounds = filterPharmacies(pharmacies.map(row => new Pharmacy(row)), state.filters);
    const center = state.filters.bounds?.getCenter();
    const store = useStore();

    function handleClick (pharmacyId: number) {
        store.dispatch(selectPharmacy(pharmacies.find(row => row.id === pharmacyId) || null))
    }

    function handleLocationClick(e: React.MouseEvent<HTMLButtonElement>, pharmacy: Pharmacy) {
        e.stopPropagation();
        console.log(e);

        store.dispatch(activatePharmacy(pharmacy.toObject()));
    }

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
                        <ContentTitle>
                            <a href='#' onClick={() => handleClick(row.id)}>
                                {row.name}
                            </a>
                        </ContentTitle>
                        <ContentDescription>
                            <span style={{ width: '35px', display: 'inline-block' }}>{center ? row.humanizedDistance(center) : "알수없음"}</span>
                            <span className="delimiter" style={{padding: '0 2px'}}>&#8226;</span>
                            {/*{row.isOpen(props.isHoliday) ? <AccentDescription>영업 중</AccentDescription> : "영업종료"} &#8226;*/}
                            <span style={{ display: 'inline-block', textAlign: 'left' }}>{row.todayOpeningHour(state.filters.isHoliday).humanizeWorkingHours()}</span>
                            <ContentDescriptionAddress>{(row.address_road || row.address)?.split(' ').splice(1).join(' ')}</ContentDescriptionAddress>
                        </ContentDescription>
                    </ContentColumn>
                    <ActionColumn>
                        <HoverContainer onClick={(e) => {handleLocationClick(e, row)}}>
                            <Location />
                        </HoverContainer>
                    </ActionColumn>
                </GridRow>
            ))}
            <Footer>
                {/*<div style={{marginBottom: '1rem'}}>*/}
                {/*    */}
                {/*    <BorderCircle >*/}
                {/*        <Mail />*/}
                {/*    </BorderCircle>*/}
                {/*    </a>*/}
                {/*</div>*/}
                <span style={{fontSize: '13px'}}>&copy;&nbsp;
                    <a href={`mailto:${EMAIL_ADDRESS}?Subject=[심야약국] 문의`}>
                        <span style={{textDecoration: 'underline'}}>mode9</span>
                    </a>
                </span>
            </Footer>
        </Wrapper>
    )
}