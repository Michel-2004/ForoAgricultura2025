using ForoAgricultura.Models.DataBase.Repositories.Implementations;
using TorchSharp.Modules;

namespace ForoAgricultura.Models.DataBase
{
    public class UnitOfWork
    {
        private readonly ForoAgriculturaContext _context;

        public UserRepository UserRepository { get; init; }
        public ComentaryRepository ComentaryRepository { get; init; }
        

        public UnitOfWork(
            ForoAgriculturaContext context, 
            UserRepository userRepository,
            ComentaryRepository comentaryRepository
        
            )
        {
            _context = context;

            UserRepository = userRepository;
            ComentaryRepository = comentaryRepository;
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
