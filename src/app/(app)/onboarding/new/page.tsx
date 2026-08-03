import TopBar from '@/components/TopBar';
import NewClientForm from './NewClientForm';

export default function NewClientPage() {
  return (
    <>
      <TopBar
        title="استلام عميل جديد"
        subtitle="املأ البيانات الأساسية وسنحسب مؤشر الجاهزية تلقائياً"
      />
      <div className="p-8">
        <NewClientForm />
      </div>
    </>
  );
}
