<template>
	<div v-if="listData">
		<table :class="'table table-dark table-hover ' + ($slots['empty-message'] ? 'mb-5' : '')">
			<thead class="thead-dark">
				<slot name="header"></slot>
			</thead>
			<tbody>
				<tr v-if="!listData.data.length">
					<slot v-if="$slots['empty-message']" name="empty-message"></slot>
				</tr>
				<template v-for="row in listData.data">
					<slot name="row" :row="row"></slot>
				</template>
			</tbody>
		</table>
		<div v-if="!$slots['empty-message'] && !listData.data.length" class="text-center">Nenhum resultado encontrado...</div>

		<pagination :data="listData" @pagination-change-page="getPaginate"></pagination>
	</div>
</template>

<script>
    export default {
        name: 'EndpointList',
		props: {
            endpoint: {
                required: true,
			},
			filter: {
                default: () => {},
			},
			paginate: {
                type: Boolean,
			},
			changeUrl: {
                type: Boolean,
			},
		},
		data: function () {
            return {
                listData: null,
			};
		},
		mounted: function () {
			this.get(this.changeUrl ? this.$route.query.page : undefined);
		},
		methods: {
            get: function (page = 1) {
                this.$emit('beforeSearch');

				axios.get(this.endpoint, {
				    params: {...this.filter, page},
				}).then((res) => {
				    this.$emit('afterSearch', res);

				    this.listData = res.data;
				});
            },
            getPaginate: function (page = 1) {
                var query = {...this.$route.query};
				query['page'] = page;

                if (this.changeUrl) {
                    if (page === 1) {
						delete query['page'];
                        this.$router.push({query: query});
					} else {
						this.$router.push({query: {...this.$route.query, ...query}});
					}
                } else {
					delete query['page'];
                    this.$router.push({query});
				}

                this.get(page);
            },
		},
    }
</script>

<style scoped>

</style>