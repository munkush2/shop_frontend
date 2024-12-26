import Swal from 'sweetalert2';

export function useAlert() {
    const showSwal = (text:string, status: 'success' | 'error' | 'warning' | 'info' | 'question') => { 
        Swal.fire({
            title: "Success",
            text: text,
            showConfirmButton: false,
            timer: 2000,
            icon: status
        });
    }
    return {showSwal}
}
