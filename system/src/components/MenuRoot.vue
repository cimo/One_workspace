<template>
	<div class="menuRoot_component mainbar_element">
		<img class="menuRoot_image" src="@/assets/images/menu_root.svg" alt="menu_root.svg" />

		<div class="menuRoot_container">
			<div class="menuRoot_side">
				<div class="menuRoot_side_container">
					<div v-for="(value, key) in menuRoot.sideItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
						<div class="item">
							<img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
						</div>
					</div>
				</div>
			</div>
			<div class="menuRoot_panel">
				<p class="label">Project</p>
				<div v-for="(value, key) in menuRoot.projectItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
					<div class="program">
						<img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
						<p class="text">{{ value.name }}</p>
					</div>
				</div>
				<p class="label">Tool</p>
				<div v-for="(value, key) in menuRoot.toolItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
					<div class="program">
						<img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
						<p class="text">{{ value.name }}</p>
					</div>
				</div>
				<p class="label">Container</p>
				<div
					v-for="(value, key) in menuRoot.containerItems"
					v-bind:key="`${key}-${value.name}`"
					class="window_opener"
					v-bind:data-category="value.category"
					v-bind:data-name="value.name"
					v-bind:data-container_name="value.containerName"
				>
					<div class="program">
						<img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
						<p class="text">{{ value.name }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as Config from "@/assets/js/Config";
	import * as Helper from "@/assets/js/Helper";

	export default {
		name: "MenuRootComponent",
		computed: {},
		methods: {
			clickLogic(event) {
				const menuRootComponent = Helper.findParent(event.target, ["menuRoot_component"]);

				if (menuRootComponent !== null) {
					this.menuRootContainer = menuRootComponent.querySelector(".menuRoot_container");

					if (menuRootComponent === null) {
						this.menuRootContainer.style.display = "none";

						return;
					}

					if (event.target.classList.contains("menuRoot_component") === true || event.target.classList.contains("menuRoot_image") === true) {
						if (this.menuRootContainer.style.display === "" || this.menuRootContainer.style.display === "none") {
							this.menuRootContainer.style.display = "block";
						} else {
							this.menuRootContainer.style.display = "none";
						}
					}

					const windowOpener = Helper.findParent(event.target, ["window_opener"]);

					if (windowOpener !== null) {
						const name = windowOpener.getAttribute("data-name");

						if (name === "VueJs") {
							const tab = window.open(`http://localhost:${Config.setting.vueJs.uiPort}`, "_blank");

							tab.focus();
						} else {
							if (Helper.promptLogic() === true) {
								return false;
							}

							this.$root.$refs.windowComponent.init(windowOpener);
						}

						this.menuRootContainer.style.display = "none";
					}
				} else if (this.menuRootContainer !== null) {
					this.menuRootContainer.style.display = "none";
				}
			}
		},
		data() {
			return {
				menuRoot: Config.setting.menuRoot,
				menuRootContainer: null
			};
		},
		created() {
			this.$root.$refs.menuRootComponent = this;
		},
		beforeDestroy() {}
	};
</script>

<style lang="scss" scoped>
	.menuRoot_component {
		.menuRoot_container {
			display: none;
			position: fixed;
			bottom: 40px;
			top: 100px;
			left: 0;
			width: 410px;

			box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
			-webkit-box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
			-moz-box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;

			.menuRoot_side {
				position: fixed;
				width: 40px;
				background: #1b5c8d;
				bottom: 40px;
				top: 100px;
				left: 0;
				cursor: default;
			}

			.menuRoot_side {
				.menuRoot_side_container {
					position: absolute;
					bottom: 0;

					.window_opener {
						position: relative;
						bottom: 0;

						.item {
							width: 40px;
							height: 40px;
							cursor: pointer;

							&:hover {
								background-color: #41a4f3;
							}

							.icon {
								margin-top: 8px;
								width: 25px;
								height: 25px;
							}
						}
					}
				}
			}

			.menuRoot_panel {
				position: fixed;
				width: 340px;
				background: #1b5c8d;
				bottom: 40px;
				top: 100px;
				left: 40px;
				cursor: default;
				margin: 0;
				padding: 20px 15px;
				text-align: left;
				overflow: auto;
				-ms-overflow-style: none;
				scrollbar-width: none;

				&::-webkit-scrollbar {
					display: none;
				}

				.label {
					margin: 10px 0px 0px 0px;
				}

				.window_opener {
					width: 107px;
					height: 107px;
					display: inline-block;
					cursor: pointer;
					text-align: center;
					margin: 3px;

					&:hover {
						background-color: #00aced;
					}

					.program {
						background-color: #0078d7;
						width: 100%;
						height: 100%;
						position: relative;

						&:hover {
							background-color: #41a4f3;
						}

						.icon {
							position: relative;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							display: block;
							width: 40px;
						}

						.text {
							position: absolute;
							color: #ffffff;
							bottom: 2px;
							left: 4px;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
</style>
