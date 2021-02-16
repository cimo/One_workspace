<template>
	<div class="data_component">
		<div class="square square_1">
			<p class="title">CPU</p>
			<p class="value"></p>
		</div>
		<div class="square square_2">
			<p class="title">MEMORY</p>
			<p class="value"></p>
		</div>
		<div class="square square_3">
			<p class="title">DISK</p>
			<p class="value"></p>
		</div>
		<div class="square square_4">
			<p class="title">NETWORK</p>
			<p class="value"></p>
		</div>
	</div>
</template>

<script>
	import * as Helper from "@/assets/js/Helper";
	import * as Sio from "@/assets/js/Sio";

	export default {
		name: "ContainerDataComponent",
		//components: {},
		computed: {},
		methods: {
			_checkStatus(containerName) {
				if (Object.keys(this.windowComponentList).length > 0) {
					this.intervalStatusList[containerName] = setInterval(() => {
						Sio.sendMessage("t_exec_i", {
							closeEnabled: false,
							tag: `${containerName}_data`,
							cmd: `docker stats ${containerName} --no-stream --format "{{.CPUPerc}}[-]{{.MemUsage}}[-]{{.BlockIO}}[-]{{.NetIO}}"`
						});
					}, 1000);

					Sio.readMessage(`t_exec_o_${containerName}_data`, (data) => {
						if (this.windowComponentList[containerName] !== undefined) {
							let result = data.out !== undefined ? data.out : data.err;

							if (result !== undefined) {
								result = result.split("[-]");

								if (result.length > 1) {
									this.windowComponentList[containerName].querySelector(".data_component .square_1 .value").innerHTML = result[0];
									this.windowComponentList[containerName].querySelector(".data_component .square_2 .value").innerHTML = result[1];
									this.windowComponentList[containerName].querySelector(".data_component .square_3 .value").innerHTML = result[2];
									this.windowComponentList[containerName].querySelector(".data_component .square_4 .value").innerHTML = result[3];
								}
							}
						}
					});
				}
			},
			init(windowComponent) {
				const currentWindowElement = Helper.currentWindowElement(windowComponent);

				if (currentWindowElement !== null) {
					this.windowComponentList[currentWindowElement.containerName] = windowComponent;

					this._checkStatus(currentWindowElement.containerName);
				}
			},
			close(windowComponent) {
				const currentWindowElement = Helper.currentWindowElement(windowComponent);

				if (currentWindowElement !== null && currentWindowElement.containerName !== null) {
					Sio.stopRead(`t_exec_o_${currentWindowElement.containerName}_data`);

					clearInterval(this.intervalStatusList[currentWindowElement.containerName]);

					delete this.windowComponentList[currentWindowElement.containerName];
					delete this.intervalStatusList[currentWindowElement.containerName];
				}
			}
		},
		data() {
			return {
				windowComponentList: [],
				intervalStatusList: []
			};
		},
		created() {
			this.$root.$refs.containerDataComponent = this;
		},
		beforeDestroy() {}
	};
</script>

<style lang="scss" scoped>
	.data_component {
		display: none;
		position: absolute;
		top: 28px;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0;

		.square {
			.title {
				position: relative;
				top: 40%;
				font-size: 32px;
			}

			.value {
				position: relative;
				top: 45%;
			}
		}

		.square_1 {
			position: absolute;
			top: 0;
			left: 0;
			right: 50%;
			bottom: 50%;
			border-right: 1px solid #cccccc;
			border-bottom: 1px solid #cccccc;
			text-align: center;
		}

		.square_2 {
			position: absolute;
			top: 0;
			left: 50%;
			right: 0;
			bottom: 50%;
			border-bottom: 1px solid #cccccc;
			text-align: center;
		}

		.square_3 {
			position: absolute;
			top: 50%;
			left: 0;
			right: 50%;
			bottom: 0;
			border-right: 1px solid #cccccc;
			text-align: center;
		}

		.square_4 {
			position: absolute;
			top: 50%;
			left: 50%;
			right: 0;
			bottom: 0;
			text-align: center;
		}
	}
</style>