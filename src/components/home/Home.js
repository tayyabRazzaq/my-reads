import React, {Component} from 'react';
import BookShelf from './BookShelf';
import {Dictionaries} from '../../utils/constants';
import * as BooksAPI from '../../utils/BooksAPI';

class Home extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			books: [],
			bookShelves: [],
			dataLoaded: false,
		};
	}
	
	componentDidMount() {
		BooksAPI.getAll().then((books) => {
			const bookShelves = Object.keys(Dictionaries.BOOK_STATUS).map(bookStatusKey => {
				const currentShelfBooks = books.filter(book => book.shelf === bookStatusKey);
				const shelfTitle = Dictionaries.BOOK_STATUS[bookStatusKey];
				return {title: shelfTitle, books: currentShelfBooks};
			});
			this.setState({books, bookShelves, dataLoaded: true});
		});
	}
	
	onStatusChange = (bookShelfIndex, bookIndex, value) => {
		if (value === '-1') {
			return;
		}
		let { books, bookShelves } = this.state;
		let book = bookShelves[bookShelfIndex]['books'][bookIndex];
		if (value === book.shelf) {
			return;
		}
		BooksAPI.update(book, value).then(response => {
			const bookShelves = Object.keys(response).map(bookStatusKey => {
				let booksId = response[bookStatusKey];
				const currentShelfBooks = books.filter(book => booksId.includes(book.id));
				const shelfTitle = Dictionaries.BOOK_STATUS[bookStatusKey];
				return {title: shelfTitle, books: currentShelfBooks};
			});
			this.setState({bookShelves});
		});
	};
	
	render() {
		const {bookShelves, dataLoaded} = this.state;
		if (!dataLoaded) {
			return <div/>;
		}
		return (
			<div className="list-books">
				<div className="list-books-title">
					<h1>MyReads</h1>
				</div>
				<div className="list-books-content">
					{
						bookShelves.map((bookShelf, bookShelfIndex) => {
							return (
								<BookShelf
									key={bookShelfIndex}
									{...bookShelf}
									onChange={
										(bookIndex, value) => this.onStatusChange(bookShelfIndex, bookIndex, value)}
								/>
							)
						})
					}
				</div>
				<div className="open-search">
					<button onClick={() => this.props.history.push('/search')}>Add a book</button>
				</div>
			</div>
		);
	}
}

export default Home;