import { redirect } from "next/navigation";

// Rota raiz redireciona para a tela da TV
export default function RootPage() {
  redirect("/tv");
}
