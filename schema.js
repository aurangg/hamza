const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Portfolio Type
const PortfolioType = new GraphQLObjectType({
    name:'Portfolio',
    fields:() => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        github: {type: GraphQLString},
        website: {type: GraphQLString}
    })
})

const EmailType = new GraphQLObjectType({
    name: 'Email',
    fields:() => ({
        id: {type: GraphQLInt},
        email: {type: GraphQLString},
        message:{type: GraphQLString}
    })
})

const BasicType = new GraphQLObjectType({
    name: 'Basic Information',
    description: 'Basic Information about you',
    fields:() => ({
        name: {type: GraphQLString},
        education: {type: GraphQLString},
        institute: {type: GraphQLString},
        batch: {type: GraphQLString}
    })
})

const InterestType = new GraphQLObjectType({
    name: 'Interests',
    description: 'Interests of Ameer Hamza',
    fields:() => ({
        id: {type: GraphQLInt},
        interestName: {type: GraphQLString}
    })
})

//Root Query

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        portfolio:{
            type:PortfolioType,
            args:{
                id: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/portfolios/' + args.id)
                    .then(res => res.data)

            }
        },
        portfolios:{
            type: new GraphQLList(PortfolioType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/portfolios')
                    .then(res => res.data)
            }
        },
        email:{
            type:EmailType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/emails/' + args.id)
                    .then(res=> res.data)
            }
        },
        emails:{
            type: new GraphQLList(EmailType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/emails')
                    .then(res => res.data)
            }
        },
        interest:{
            type: InterestType,
            args:{
                id:{type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/interests/' + args.id)
                    .then(res => res.data)
            }
        },
        interests:{
            type: new GraphQLList(InterestType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/interests')
                    .then(res => res.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPortfolio:{
            type:PortfolioType,
            args:{
                name:{ type: new GraphQLNonNull(GraphQLString) },
                description:{ type: new GraphQLNonNull(GraphQLString) },
                github:{ type: GraphQLString },
                website:{ type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/portfolios', {
                    name: args.name,
                    description: args.description,
                    github: args.github,
                    website: args.website
                }).then(res => res.data)
            }
        },
        deletePortfolio:{
            type:PortfolioType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/portfolios/'+args.id)
                    .then(res => res.data)
            }
        },
        updatePortfolio:{
            type: PortfolioType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                github: {type: GraphQLString},
                website: {type: GraphQLString},
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/portfolios/'+args.id, args)
                    .then(res => res.data)
            }
        },
        sendEmail:{
            type:EmailType,
            args:{
                email: {type: new GraphQLNonNull(GraphQLString)},
                message: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/emails', {
                    email:args.email,
                    message:args.message,
                }).then(res=> res.data)
            }
        },
        deleteEmail:{
            type:EmailType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/emails/' + args.id, args)
                    .then(res => res.data)
            }
        },
        addInterest:{
            type: InterestType,
            args: {
                interestName: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/interests', {
                    interestName: args.interestName
                }).then(res => res.data)
            }
        },
        editInterest:{
            type: InterestType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                interestName: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/interests/' + args.id, args)
                    .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
});