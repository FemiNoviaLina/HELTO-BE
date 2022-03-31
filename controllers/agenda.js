import { responseBody } from "../helpers/base_response.js"
import { statusCode } from "../helpers/constant.js"
import { prisma } from '../index.js'
import { toDate } from "../helpers/string_util.js"

const postAgenda = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { name, date } = req.body
    let agenda
    
    try {
        agenda = await prisma.agenda.create({
            data: { name, date: toDate(date) }
        })
    } catch(e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Agenda berhasil dibuat', agenda))
}

const getAgenda = async (req, res) => {
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const take = req.query.limit ? parseInt(req.query.limit) : 10

    let agenda
    try {
        agenda = await prisma.agenda.findMany({
            orderBy: { date: "desc" }, skip, take
        })
    } catch(e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(agenda.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tidak ada agenda untuk ditampilkan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Agenda berhasil ditemukan', agenda))
}

const getAgendaById = async (req, res) => {
    let agenda
    try {
        agenda = await prisma.agenda.findUnique({
            where: {
                id: req.params.id
            }
        })
    } catch(e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(!agenda) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Agenda tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Agenda berhasil ditemukan', agenda))
}

const updateAgenda = async (req, res) => {
    console.log(req.body)
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    let agenda
    try {
        agenda = await prisma.agenda.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                date: req.body.date ? toDate(req.body.date) : undefined
            }
        })
    } catch(e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Agenda tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Agenda berhasil diupdate'))
}

const deleteAgenda = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    let agenda
    try {
        agenda = await prisma.agenda.delete({
            where: {
                id: req.params.id
            }
        })
    } catch(e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Agenda tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Agenda berhasil dihapus'))
}

export { postAgenda, getAgenda, getAgendaById, updateAgenda, deleteAgenda }
