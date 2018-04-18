/**
 * New node file
 */
var competenceAction = require('../action/competenceAction');

exports.queryCompetence = function(req, res, exceptionHandler){
	
	return competenceAction.queryCompetence(req, res);
};

exports.competenceDelete = function(req, res, exceptionHandler){
	
	return competenceAction.competenceDelete(req, res);
}
exports.competenceAdd = function(req, res, exceptionHandler){
	
	return competenceAction.competenceAdd(req, res);
}
exports.competenceEdit = function(req, res, exceptionHandler){
	
	return competenceAction.competenceEdit(req, res);
}