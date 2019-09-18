import React,{Component} from 'react';
import {graphql, withApollo} from 'react-apollo';
import {compose} from "redux";
import {getAuthorsQuery, getBooksQuery} from '../queries/queries';
import {addBookMutation} from '../mutation/mutations';
import {gql} from 'apollo-boost'

const authorOne = gql`
  {
    authors @client {
        name
    }
  }
`


class AddBook extends Component {
    constructor(props){
        super(props);
        this.state={
            name:'',
            genre:'',
            authorId:''
        };
}
    displayAuthors(){
        var data=this.props.getAuthorsQuery;
        console.log(this.props);
        if(data.loading){
            return(<option disabled>data is loading...</option>)
        }
        else{
            return data.authors.map(author=>{
                return(
                        <option key={author.id} value={author.id}>{author.name}</option>
                )
            })
        }
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log(this.state);
        this.props.addBookMutation({
            variables:{
                name:this.state.name,
                genre: this.state.genre,
                authorId:this.state.authorId
            },
            refetchQueries:[{query:getBooksQuery}]
        });
        // client.mutate({mutation: "",variables:{}, refetchQueries: [{query: getAuthorsQuery}]})
    }
    render() {
        console.log('authors data is',this.props.data);
        const {client} = this.props
        return (
                <form action="" id='add-book' onSubmit={this.handleSubmit}>
                    <div onClick={e => console.log("authorOne", client.readQuery({query:authorOne}))} className='field'>
                        <label htmlFor="book name">Book name</label>
                        <input type="text" onChange={ e=>{this.setState({name:e.target.value})}}/>
                    </div>
                    <div className="field">
                        <label htmlFor="genre">Genre</label>
                        <input type="text" onChange={e =>{this.setState({genre:e.target.value})}}/>
                    </div>
                    <div className='field'>
                        <label htmlFor="author">author</label>
                        <select onChange={e=>{this.setState({authorId:e.target.value})}}>
                            <option value="">Select author</option>
                            {this.displayAuthors()}
                        </select>
                    </div>
                    <button>+</button>
                </form>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery,{name:"getAuthorsQuery"}),
    graphql(addBookMutation,{name:"addBookMutation"})
)(withApollo(AddBook));
