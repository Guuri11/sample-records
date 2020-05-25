import React, { Component } from 'react';

class CommentForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { auth, img, handleComment, handleDelete, submited, success } = this.props
        return (
            auth ?
                <div className="comment-box add-comment">
                    <span className="commenter-pic mb-3 mb-3 float-left">
                        <img src={"/img/users/profile/"+img} className="img-fluid"/>
                    </span>
                    {/*
                        Check if is submited or not
                        if submited check if the send was successful or not

                        This will display a message in each case
                    */}
                    {
                        submited ?
                            success ?
                                <span className="commenter-name">
                                    <p className="text-success">¡Comentario enviado!</p>
                                    <form onSubmit={handleComment}>
                                        <input type="text" placeholder="Escribe un comentario..." id={"comment_user"} name="comment"/>
                                        <button type="submit" className="btn btn-default">Comentar</button>
                                        <button type="cancel" className="btn btn-default btn-danger" onClick={handleDelete}>Borrar</button>
                                    </form>
                                </span>
                                :
                                <span className="commenter-name">
                                    <p className="text-danger">¡No se pudo enviar el comentario!</p>
                                    <form onSubmit={handleComment}>
                                        <input type="text" placeholder="Escribe un comentario..." id={"comment_user"} name="comment"/>
                                        <button type="submit" className="btn btn-default">Comentar</button>
                                        <button type="cancel" className="btn btn-default btn-danger" onClick={handleDelete}>Borrar</button>
                                    </form>
                                </span>
                            :
                            <span className="commenter-name">
                                <form onSubmit={handleComment}>
                                    <input type="text" placeholder="Escribe un comentario..." id={"comment_user"} name="comment"/>
                                    <button type="submit" className="btn btn-default">Comentar</button>
                                    <button type="cancel" className="btn btn-default btn-danger" onClick={handleDelete}>Borrar</button>
                                </form>
                            </span>
                    }
                </div>
                :
                <div className="comment-box add-comment">
                    <span className="commenter-pic mb-3 mb-3 float-left">
                        <img src="/img/users/profile/user-default.png" className="img-fluid"/>
                    </span>
                    {
                        submited ?
                            <span className="commenter-name">
                                <p className="text-danger">¡Necesitas estar registrado para poder comentar!</p>
                                <form onSubmit={handleComment}>
                                    <input type="text" placeholder="Escribe un comentario..." id={"comment_user"} name="comment"/>
                                    <button type="submit" className="btn btn-default">Comentar</button>
                                    <button type="cancel" className="btn btn-default btn-danger" onClick={handleDelete}>Borrar</button>
                                </form>
                            </span>
                            :
                            <span className="commenter-name">
                                <p className="text-info">¡Necesitas estar registrado para poder comentar!</p>
                                <form onSubmit={handleComment}>
                                    <input type="text" placeholder="Escribe un comentario..." id={"comment_user"} name="comment"/>
                                    <button type="submit" className="btn btn-default">Comentar</button>
                                    <button type="cancel" className="btn btn-default btn-danger" onClick={handleDelete}>Borrar</button>
                                </form>
                            </span>
                    }
                </div>
        );
    }
}
export default CommentForm;