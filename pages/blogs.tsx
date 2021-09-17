import React from 'react';


function Loading () {
    return (
        <h1>로딩 중...</h1>
    )
}
class Blogs extends React.Component {
    state = {
        pharmacies: [],
    }
    componentDidMount() {
        fetch('http://localhost:3000/api/pharmacies')
            .then((res) => res.json())
            .then((pharmacies) => {
                this.setState({
                    pharmacies: pharmacies
                })
            })
    };

    render() {
        // console.log(pharmacies);

        const { pharmacies } = this.state;
        return (
            <ul>
                {pharmacies.length ? pharmacies.map((pharm, idx) => (
                    <li key={idx}>{pharm.name}</li>
                )) : <Loading />
            }
            </ul>
        )
    }
}

// function Blogs({ pharmacies }) {
//     return (
//         <ul>
//         {pharmacies.map((pharm) => (
//             <li>{pharm.name}</li>
//         ))}
//         </ul>
//     )
// }

// export async function getStaticProps() {
//     const res = await fetch('http://localhost:3000/api/pharmacies');
//     const pharmacies = await res.json()

//     return {
//         props: {
//             pharmacies,
//         }
//     }
// }

export default Blogs;