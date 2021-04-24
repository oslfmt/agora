import React, { Component } from 'react'

export default class Footer extends Component {
	render() {
		return (
			<div>
				<footer className="bg-dark text-center text-white">
					{/* Grid container */}
					<div className="container p-4 pb-0">
						{/* Section: Social media */}
						<section className="mb-4">
						{/* Facebook */}
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
							<i className="fab fa-facebook-f"></i>
						</a>

						{/* Twitter */}
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
							<i className="fab fa-twitter"></i>
						</a>

						{/* Google */}
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
							<i className="fab fa-google"></i>
						</a>

						{/* Instagram */}
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
							<i className="fab fa-instagram"></i>
						</a>

						{/* Linkedin */}
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
							<i className="fab fa-linkedin-in"></i>
						</a>

						{/* Github */}
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
							<i className="fab fa-github"></i>
						</a>
						</section>
						{/* Section: Social media */}
					</div>
					{/* Grid container */}

					{/* Copyright */}
					{/* style="background-color: rgba(0, 0, 0, 0.2);"*/}
					<div className="text-center p-3">
						<p>© 2021 Copyright <a className="text-white" href="http://localhost:3000/">Collancer</a></p>
					</div>
					{/* Copyright */}
					</footer>
			</div>
		)
	}
}
