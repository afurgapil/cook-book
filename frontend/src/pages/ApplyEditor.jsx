import { useForm, ValidationError } from "@formspree/react";
import { useNavigate } from "react-router-dom";
function AppylEditor() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_KEY);
  const navigate = useNavigate();
  if (state.succeeded) {
    setTimeout(() => {
      navigate("/");
    }, 5000);
    return (
      <div className="container" id="page">
        <div className="row my-5">
          <div className="col-md-8 offset-md-2 text-center">
            <h2 className="display-4 mb-4 ">YANITINIZ BAŞARIYLA KAYDEDİLDİ</h2>
            <h3 className="lead">ANASAYFAYA YÖNLENDİRİLİYORSUNUZ</h3>
            <div className="spinner-border  mt-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="page" className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Mail Adresiniz
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-control"
            placeholder="Üye olduğunuz mail adresinizi giriniz"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Kullanıcı Adınız
          </label>
          <textarea
            id="username"
            name="username"
            className="form-control"
            placeholder="Üye olduğunuz kullanıcı adınız"
          />
          <ValidationError
            prefix="Username"
            field="username"
            errors={state.errors}
          />
        </div>

        <div className="mb-3 d-flex flex-column ">
          <label>Yemekler</label>

          <div className="d-flex flex-row ">
            <textarea
              id="food"
              name="food"
              className="form-control w-50"
              placeholder="En sevdiğiniz yemek"
            />
            <textarea
              id="foodd"
              name="foodd"
              className="form-control w-50"
              placeholder="En iyi yaptığınız yemek"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fs-5">
            Etliekmek ve Lahmacun aynı şey midir?
          </label>
          <div>
            <label className="form-check form-check-inline">
              <input
                type="radio"
                name="question"
                value="evet"
                className="form-check-input"
              />
              Evet
            </label>
            <label className="form-check form-check-inline">
              <input
                type="radio"
                name="question"
                value="hayır"
                className="form-check-input"
              />
              Hayır
            </label>
          </div>
          <ValidationError
            prefix="Question"
            field="question"
            errors={state.errors}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={state.submitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AppylEditor;
