import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";

// tslint:disable-next-line no-unused-expression
new Vue({
	computed: {
		hazGames(): boolean {
			return this.isLoading === false && this.games.length > 0;
		},
		noGames(): boolean {
			return this.isLoading === false && this.games.length === 0;
		}
	},

	data() {
		return {
			company: "",
			games: [],
			genre: "",
			isLoading: true,
			selectedGame: "",
			selectedGameId: 0,
			title: "",
			year: ""
		};
	},
	el: "#app",
	methods: {
		addGame() {
			const game = {
				company: this.company,
				genre: this.genre,
				title: this.title,
				year: this.year
			};
			axios
				.post("/api/games/add", game)
				.then(() => {
					this.$refs.year.focus();
					this.title = "";
					this.company = "";
					this.genre = "";
					this.loadGames();
				})
				.catch((err: any) => {
					// tslint:disable-next-line:no-console
					console.log(err);
				});
		},
		confirmDeleteGame(id: string) {
			const game = this.games.find((g) => g.id === id);
			this.selectedGame = `${game.year} ${game.title}${game.genre}`;
			this.selectedGameId = game.id;
			const dc = this.$refs.deleteconfirm;
			const modal = M.Modal.init(dc);
			modal.open();
		},
		deleteGame(id: string) {
			axios.delete(`/api/games/remove/${id}`).then(this.loadGames).catch((err: any) => {
				// tslint:disable-next-line:no-console
				console.log(err);
			});
		},
		loadGames() {
			axios
				.get("/api/games/all")
				.then((res: any) => {
					this.isLoading = false;
					this.games = res.data;
				})
				.catch((err: any) => {
					// tslint:disable-next-line:no-console
					console.log(err);
				});
		}
	},
	mounted() {
		return this.loadGames();
	}
});
